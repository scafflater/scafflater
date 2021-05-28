/* eslint-disable no-undef */
const TemplateSource = require('./template-source')
const GitTemplateSource = require('./git-template-source')

test('Throws an exception when the source does not exists', () => {
  // ARRANJE
  const config = {source: 'bla'}
  const ts = new TemplateSource()

  // ACT and ASSERT
  expect(() => {
    ts.getTemplateSource(config)
  }).toThrowError("There's no module for source 'bla'")
})

test('Gets the template source in config', () => {
  // ARRANJE
  const config = {source: 'github'}
  const ts = new TemplateSource(config)

  // ACT
  const result = ts.getTemplateSource(config)

  // ASSERT
  // eslint-disable-next-line no-proto
  expect(result.__proto__ instanceof TemplateSource).toBe(true)
  expect(result instanceof GitTemplateSource).toBe(true)
})
