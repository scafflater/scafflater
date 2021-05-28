/* eslint-disable no-undef */
const TemplateStorage = require('./template-storage')
const LocalTemplateStorage = require('./local-template-storage')

test('Throws an exception when the storage does not exists', () => {
  // ARRANJE
  const config = {storage: 'bla'}
  const ts = new TemplateStorage()

  // ACT and ASSERT
  expect(() => {
    ts.getTemplateStorage(config)
  }).toThrowError("There's no module for source 'bla'")
})

test('Gets the template storage in config', () => {
  // ARRANJE
  const config = {storage: 'local'}
  const ts = new TemplateStorage(config)

  // ACT
  const result = ts.getTemplateStorage(config)

  // ASSERT
  // eslint-disable-next-line no-proto
  expect(result.__proto__ instanceof TemplateStorage).toBe(true)
  expect(result instanceof LocalTemplateStorage).toBe(true)
})
