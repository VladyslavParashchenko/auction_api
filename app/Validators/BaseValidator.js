const Antl = use('Antl')

class BaseValidator {
  get validateAll () {
    return true
  }

  get messages () {
    let messages = {}
    let rulesArr, messageName, messageText
    for (let fieldName in this.rules) {
      rulesArr = this.rules[fieldName].split('|')
      rulesArr = rulesArr.map(this.parseValidationRule)
      rulesArr.forEach((rule) => {
        messageName = fieldName + '.' + rule.ruleName
        try {
          messageText = Antl.formatMessage(`validation.${rule.ruleName}`, { name: fieldName, value: rule.value })
          messages[messageName] = messageText
        } catch (e) {
          console.log(`validation.${rule.ruleName} is not found in locales`)
        }
      })
    }
    return messages
  }

  parseValidationRule (rule) {
    if (rule.indexOf(':') === -1) {
      return { ruleName: rule }
    } else {
      let ruleAndValue = rule.split(':')
      return {
        ruleName: ruleAndValue[0].trim(),
        value: ruleAndValue[1].replace(',', ' ')
      }
    }
  }
}

module.exports = BaseValidator
