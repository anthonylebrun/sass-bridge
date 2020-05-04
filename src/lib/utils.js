function isObject(v) {
  return typeof v === 'object' && v !== null
}

function hasFunctionProperties(v) {
  return Object.values(v).every((p) => typeof p === 'function')
}

export {
  isObject,
  hasFunctionProperties
}