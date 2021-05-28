/* eslint-disable no-undef */
const Scafflater = require('./scafflater')

test('Throws an exception when the source does not exists', () => {
  // ARRANJE
  const scf = new Scafflater({source: 'bla'})

  // ACT and ASSERT
  expect(() => {
    scf.getTemplateSource()
  }).toThrowError("There's no source for 'bla'")
})
