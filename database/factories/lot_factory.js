'use strict'

const dayjs = require('dayjs')

const factory = async (faker, i, data) => {
  return {
    title: data.title || 'new_title',
    current_price: data.current_price || 2000,
    estimated_price: data.estimated_price || 3000,
    description: data.description || 'text',
    user_id: data.user_id,
    start_time: dayjs().add(7, 'day'),
    end_time: dayjs().add(10, 'day')
  }
}

module.exports = factory
