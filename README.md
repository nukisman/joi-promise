
# Install

`npm install joi-promise --save`

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

# Todo

* Check promise state:
    * Joi.promise().pending()
    * Joi.promise().fulfilled(Joi schema for value) - match value now
    * Joi.promise().rejected(Joi schema for reason) - match reason now
    * promise = JoiPromise(promise, Joi.promise().meta({then: ..., catch: ...})) // wrap like joi-func
* Check specific methods for popular promises implementations:
    * when.js: require('joi-promise/when')
    * q.js: require('joi-promise/q')
    * bluebird.js: require('joi-promise/bluebird')
    * ES6 promise: require('joi-promise/es6')