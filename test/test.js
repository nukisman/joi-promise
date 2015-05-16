/**
 * Created by Alexander Nuikin (nukisman@gmail.com) on 16.05.15.
 */

var should = require('should')
var when = require('when')
var Joi = require('joi')
require('../lib/')(Joi) // extend original Joi
//require('joi-promise')(Joi)

describe('Promise', function () {

    var schema = Joi.promise().required()

    it('Not object', function () {
        var value = 1
        var v = Joi.validate(value, schema)
        v.should.have.property('error').which.is.Error
        v.error.should.property('name').is.String.eql('ValidationError')
        v.error.should.property('message').is.String.eql('"value" must be an object')
        v.value.should.be.eql(value)
    })

    it('Not promise', function () {
        var value = {}
        var v = Joi.validate(value, schema)
        v.should.have.property('error').which.is.Error
        v.error.should.property('name').is.String.eql('ValidationError')
        v.error.should.property('message').is.String.eql('"value" must have .then() method')
        v.value.should.be.eql(value)
    })

    it('Undefined (optional)', function () {
        var value = undefined
        var v = Joi.validate(value, Joi.promise().optional())
        should(v.error).be.null
        should(v.value).be.undefined
    })

    function testOk(value) {
        var v = Joi.validate(value, schema)
        should(v.error).be.null
        v.value.should.be.eql(value)
    }

    it('When.js', function () {
        testOk(when.resolve(123))
        var value = when.reject(new Error('Aaa!!!'))
        testOk(value)
        value
            .catch(function (e) {
                e.name.should.be.eql('Error')
                e.message.should.be.eql('Aaa!!!')
            })
            .done()
    })
})