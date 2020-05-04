import { InvalidArgumentError } from './lib/errors'

import {
  isObject,
  hasFunctionProperties,
} from './lib/utils'

import {
  castToJs,
  castToSass,
} from './lib/sass'

function validateArgument(arg) {
  if (!isObject(arg) || !hasFunctionProperties(arg)) {
    throw InvalidArgumentError
  }
}

function wrap(fn) {
  return function(...args) {
    const jsArgs = [ ...args ].map((arg) => {
      return castToJs(arg)
    })

    return castToSass(fn(...jsArgs))
  }
}

export default function sassBridge(functions) {
  validateArgument(functions)

  const bridges = {}

  Object.entries(functions).forEach(([key, fn]) => {
    Object.assign(bridges, { [key]: wrap(fn) })
  })

  return bridges
}