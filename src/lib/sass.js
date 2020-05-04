import { NoSassImplementationError } from './errors'
import _ from 'lodash'

function requireSass() {
  try {
    return require('sass')
  } catch {
    try {
      return require('node-sass')
    } catch {
      throw NoSassImplementationError
    }
  }
}

const sass = requireSass()
const sassUtils = require('node-sass-utils')(sass)

function castToColor(sassValue) {
  return {
    R: sassValue.getR(),
    G: sassValue.getG(),
    B: sassValue.getB(),
    A: sassValue.getA(),
  }
}

function castToJs(sassValue) {
  if (sassUtils.typeOf(sassValue) === 'color') {
    return castToColor(sassValue)
  }

  // We are assuming that you are using a SASS strings as key in your maps. We're also overriding
  // some of node-sass-utils implementation. One the one hand, this is hacky and fragile. On the
  // other hand, it makes it easy a lot easier to work with for the majority use case.
  if (sassUtils.typeOf(sassValue) === 'map') {
    const sassJsMap = sassUtils.castToJs(sassValue)

    sassJsMap._get = sassJsMap.get
    sassJsMap.get = function(key) {
      return castToJs(this._get(new sass.types.String(key)))
    }

    sassJsMap._set = sassJsMap.set
    sassJsMap.set = function(key, value) {
      return this._set(new sass.types.String(key), castToSass(value))
    }

    return sassJsMap
  }

  return sassUtils.castToJs(sassValue)
}

function isDimension(jsValue) {
  return jsValue.hasOwnProperty('value') &&
         jsValue.hasOwnProperty('numeratorUnits')
}

function isColor(jsValue) {
  return jsValue.hasOwnProperty('R') &&
         jsValue.hasOwnProperty('G') &&
         jsValue.hasOwnProperty('B') &&
         jsValue.hasOwnProperty('A')
}

function inferSassValue(jsValue) {
  let result;

  try {  
    sass.renderSync({
      data: `$_: ___((${jsValue}));`,
      functions: {
        '___($value)': (value) => {
          result = value

          return value
        }
      }
    });
  } catch(e) {
    return jsValue
  }

  return result
}

function castToSass(jsValue) {
  sassUtils.infect(sass.types)
  if (jsValue && !(typeof sassUtils.castToSass(jsValue) === 'function')) {  

    if (isDimension(jsValue)) {
      jsValue = new sass.types.Number(jsValue.value, jsValue.numeratorUnits[0]);

    } else if (isColor(jsValue)) {
      const { R, G, B, A } = jsValue
      jsValue = new sass.types.Color(R, G, B, A)

    } else if (_.isString(jsValue)) {
      jsValue = inferSassValue(jsValue)

    } else if (_.isArray(jsValue)) {
      jsValue = _.map(jsValue, (item) => {
        return castToSass(item)
      })

    } else if (_.isObject(jsValue)) {
      jsValue = _.mapValues(jsValue, (subval) => {
        return castToSass(subval)
      })
    }
  }

  return sassUtils.castToSass(jsValue)
};

export {
  castToJs,
  castToSass
}