# Usage Example
```js
var Joi = require('joi')
require('joi-promise')(Joi) // extend original Joi

var schema = Joi.promise().required()

Joi.assert(123, schema) // Error: "value" must be an object
Joi.assert({}, schema) // Error: "value" must have .then() method

var when = require('when')

Joi.assert(when.resolve(123), schema) // ok
```
