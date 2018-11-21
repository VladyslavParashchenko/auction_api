const Antl = use('Antl');

module.exports = {

  generateError (ruleName, fieldName, fieldValue) {
    return [
      {
        message: Antl.formatMessage(`validation.${ruleName}`, { name: fieldName, value: fieldValue }),
        field: fieldName,
        validation: snackCaseToCamelCase(ruleName)
      }
    ];
  }
};

function snackCaseToCamelCase (string) {
  return string.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
