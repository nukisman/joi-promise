/**
 * Created by Alexander Nuikin (nukisman@gmail.com) on 16.05.15.
 */

var should = require('should')
var when = require('when')
var Joi = require('joi')
require('../lib/')(Joi) // extend original Joi
//require('joi-promise')(Joi)

function shouldMatch(promise, schema) {
    var v = Joi.validate(promise, schema)
    should(v.error).be.null
    v.value.should.be.eql(promise)
}

function shouldError(promise, schema, name, message) {
    var v = Joi.validate(promise, schema)
    console.log('v.value:', JSON.stringify(v.value))
    console.log('promise:', JSON.stringify(promise))

    v.value.should.be.eql(promise)
    should(v.error).be.not.null
    v.error.name.should.be.eql(name)
    v.error.message.should.be.eql(message)
}

function shouldRejected(done, promise, name, message) {
    promise
        .catch(function (e) {
            e.name.should.be.eql(name)
            e.message.should.be.eql(message)
        })
        .done(function(v) {
            done()
        })
}

describe('Promise', function () {

    var schema = Joi.promise().required()

    it('Not object', function () {
        var promise = 1
        var v = Joi.validate(promise, schema)
        v.should.have.property('error').which.is.Error
        v.error.should.property('name').is.String.eql('ValidationError')
        v.error.should.property('message').is.String.eql('"value" must be an object')
        v.value.should.be.eql(promise)
    })

    it('Not promise', function () {
        var promise = {}
        var v = Joi.validate(promise, schema)
        v.should.have.property('error').which.is.Error
        v.error.should.property('name').is.String.eql('ValidationError')
        v.error.should.property('message').is.String.eql('"value" must have .then() method')
        v.value.should.be.eql(promise)
    })

    it('Undefined (optional)', function () {
        var promise = undefined
        var v = Joi.validate(promise, Joi.promise().optional())
        should(v.error).be.null
        should(v.value).be.undefined
    })

    it('When.js', function (done) {
        shouldMatch(when.resolve(123), schema)
        var promise = when.reject(new Error('Aaa!!!'))
        shouldMatch(promise, schema)
        shouldRejected(done, promise, 'Error', 'Aaa!!!')
    })
})

describe('Fulfilled', function() {
    it('No value specified', function () {
        shouldMatch(when.resolve(123), Joi.promise().fulfilled())
    })

    it('Value to equal', function () { // TODO: complex value (deep equal ??)
        shouldMatch(when.resolve(123), Joi.promise().fulfilled(123))
        shouldError(when.resolve(123), Joi.promise().fulfilled(456),
            'ValidationError', '"value" must match Joi schema')
    })

    it('Value schema to match', function () {
        shouldMatch(when.resolve(123), Joi.promise().fulfilled(Joi.number().equal(123)))
        shouldError(when.resolve(123), Joi.promise().fulfilled(Joi.number().equal(456)),
            'ValidationError', '"value" must match Joi schema')
    })
})

describe('Rejected', function() {
    it('No reason specified', function (done) {
        var promise = when.reject(new Error('Some problem'))
        shouldMatch(promise, Joi.promise().rejected())
        shouldRejected(done, promise, 'Error', 'Some problem')
    })

    it('Reason to equal', function () { // TODO: complex value (deep equal ??)
        var reason = new Error('Some problem')
        var promise = when.reject(reason)
        shouldMatch(promise, Joi.promise().fulfilled(reason))
        //shouldError(promise, Joi.promise().fulfilled(new Error('Other problem')),
        //    'ValidationError', '"value" must match Joi schema')
        //promise.done()
    })

    //it('Reason schema to match', function () {
    //    shouldMatch(when.resolve(123), Joi.promise().fulfilled(Joi.number().equal(123)))
    //    shouldError(when.resolve(123), Joi.promise().fulfilled(Joi.number().equal(456)),
    //        'ValidationError', '"value" must match Joi schema')
    //})
})