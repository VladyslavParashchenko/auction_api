module.exports = {

  generateError (ruleName, fieldName) {
    return [
      {
        field: fieldName,
        validation: snackCaseToCamelCase(ruleName)
      }
    ]
  }
}

function snackCaseToCamelCase (string) {
  return string.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase()
  })
}
