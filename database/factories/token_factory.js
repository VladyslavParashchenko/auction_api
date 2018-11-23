'use strict'

const factory = async (faker, i, data) => {
  return {
    is_revoked: data.is_revoked || false,
    type: 'jwt_refresh_token',
    token: data.token || '1111111111111111.111111111111.11111111'
  }
}

module.exports = factory
