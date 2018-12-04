const Helpers = use('Helpers')
const FileUploaderException = use('App/Exceptions/FileUploaderException')

class Uploader {
  async uploadFile (file) {
    const fileName = this._buildName(file)
    await file.move(Helpers.publicPath('uploads'), {
      name: fileName,
      overwrite: true
    })
    if (!file.moved()) {
      throw new FileUploaderException(file.error().message)
    }
    return `uploads/${fileName}`
  }

  _buildName (file) {
    return `${file.fieldName}_${new Date().getTime()}.${file.subtype}`
  }
}

module.exports = Uploader
