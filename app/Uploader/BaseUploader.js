const Helpers = use('Helpers')

class BaseUploader {
  constructor (request) {
    this.request = request
  }

  async uploadFile (fileName) {
    if (this.isFilePresent(fileName)) {
      return ''
    }
    const file = this.request.file(fileName, this.validationOptions())
    fileName = `${fileName}_${new Date().getTime()}.${file.subtype}`
    await file.move(Helpers.publicPath('uploads'), {
      name: fileName,
      overwrite: true
    })
    if (!file.moved()) {
      throw new Error(file.error().message)
    }
    return `uploads/${fileName}`
  }

  validationOptions () {
    return {}
  }

  isFilePresent (fileName) {
    return this.request._files[fileName] === undefined
  }
}

module.exports = BaseUploader
