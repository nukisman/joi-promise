/**
 * Created by Alexander Nuikin (nukisman@gmail.com) on 16.05.15.
 */
var Joi = require('joi')
require('./lib')(Joi) // extend original Joi
//require('joi-promise')(Joi) // extend original Joi

var schema = Joi.promise().required()

Joi.assert(123, schema) // Error: "value" must be an object
Joi.assert({}, schema) // Error: "value" must have .then() method

var when = require('when')

Joi.assert(when.resolve(123), schema) // ok