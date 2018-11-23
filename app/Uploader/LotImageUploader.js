const BaseUploader = use('App/Uploader/BaseUploader')

class LotImageUploader extends BaseUploader {
  validationOptions () {
    return {
      types: ['image'],
      size: '2mb'
    }
  }
}

module.exports = LotImageUploader
