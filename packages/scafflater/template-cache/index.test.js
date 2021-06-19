/* eslint-disable no-undef */
const TemplateCache = require('./')
const LocalTemplateCache = require('./storages/home-dir-cache')

test('Throws an exception when the storage does not exists', () => {
  // ARRANGE
  const config = {cacheStorage: 'bla'}
  const ts = new TemplateCache()

  // ACT and ASSERT
  expect(() => {
    ts.getTemplateCache(config)
  }).toThrowError("There's no module for source 'bla'")
})

test('Gets the template storage in config', () => {
  // ARRANGE
  const config = {cacheStorage: 'homeDir'}
  const ts = new TemplateCache(config)

  // ACT
  const result = ts.getTemplateCache(config)

  // ASSERT
  // eslint-disable-next-line no-proto
  expect(result.__proto__ instanceof TemplateCache).toBe(true)
  expect(result instanceof LocalTemplateCache).toBe(true)
})
