const
  InvalidArgumentError = new Error('[sassBridge] InvalidArgument: sassBridge expects an Object with functions as values'),
  NoSassImplementationError = new Error('[sassBridge] NoSassImplementation: sassBridge requires either dart-sass or node-sass to be installed')

export {
  InvalidArgumentError,
  NoSassImplementationError,
}