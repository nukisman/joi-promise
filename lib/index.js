/**
 * Created by Alexander Nuikin (nukisman@gmail.com) on 16.05.15.
 */
'use strict'

var extender = require('joi-extender')

module.exports = function(Joi) {
    extender.addValidator('promise', {
        requirements: {
            object: function (val) {
                return 'object' === typeof val
            },
            then: function (val) {
                return 'function' === typeof val.then
            },
            catch: function (val) {
                return 'function' === typeof val.catch
            },
            finally: function (val) {
                return 'function' === typeof val.finally
            },
            done: function (val) {
                return 'function' === typeof val.done
            }
        },
        errmsgs: {
            object: 'must be an object',
            then: 'must have .then() method',
            catch: 'must have catch() method',
            finally: 'must have finally() method',
            done: 'must have done() method'
        }
    })
    extender.registerType(Joi, 'promise');
}