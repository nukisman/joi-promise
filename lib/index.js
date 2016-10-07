/**
 * Created by Alexander Nuikin (nukisman@gmail.com) on 16.05.15.
 */
'use strict'

var assert = require('assert')
var extender = require('joi-extender')

module.exports = (function () {
    function notPending(Joi, state) {
        return function (promise, args) {
            var valSchema
            if (args.length == 0) {
                valSchema = null // Joi.any()
            } else if (args.length == 1) {
                if (args[0].isJoi) {
                    valSchema = args[0]
                } else {
                    valSchema = Joi.any().equal(args[0])
                }
            } else if (args.length >= 1) {
                assert.fail('Joi.promise().' + state + '() requires 0 or 1 arguments')
            }

            var status = promise.inspect()
            var sv = Joi.string().equal(state).validate(status.state)
            if (sv.error) {
                return 'not-' + state
            }
            if (valSchema) {
                var vv = valSchema.validate(status.value)
                if (vv.error) {
                    return 'notMatch'
                }
            }
            return null
        }
    }

    return function (Joi) {
        extender.addValidator('promise', {
            requirements: {
                object: function (promise) {
                    return 'object' === typeof promise
                },
                then: function (promise) {
                    return 'function' === typeof promise.then
                },
                catch: function (promise) {
                    return 'function' === typeof promise.catch
                },
                finally: function (promise) {
                    return 'function' === typeof promise.finally
                },
                done: function (promise) {
                    return 'function' === typeof promise.done
                }
            },
            tests: {
                fulfilled: notPending(Joi, 'fulfilled'),
                rejected: notPending(Joi, 'rejected')
            },
            errmsgs: {
                object: 'must be an object',
                then: 'must have .then() method',
                catch: 'must have catch() method',
                finally: 'must have finally() method',
                done: 'must have done() method',
                'not-fulfilled': 'must be fulfilled with result',
                'not-rejected': 'must be fulfilled with reason',
                notMatch: 'must match Joi schema'
            }
        })
        extender.registerType(Joi, 'promise');
    }
})()