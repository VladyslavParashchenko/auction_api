'use strict'

const { test } = use('Test/Suite')('Lint')
const { exec } = require('child_process')

test('should test project on linter error', async ({ assert }) => {
  const promise = new Promise((resolve, reject) => {
    exec('node standard', async (_, stdout, __) => {
      resolve(stdout)
    })
  })
  const result = await promise
  assert.equal(result, '')
})
