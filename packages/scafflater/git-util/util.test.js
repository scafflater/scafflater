/* eslint-disable no-undef */
/* eslint-disable jest/expect-expect */
const {runCommand} = require('./utils')

test('Execute Command', async () => {
  await runCommand('ls', ['-la'])
})
