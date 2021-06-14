/* eslint-disable no-undef */
const ConfigProvider = require('config-provider')
const {RegionProvider} = require('./region-provider')

test('List regions in a well formatted content', () => {
  // ARRANJE
  const regionProvider = new RegionProvider(new ConfigProvider())
  const str = `This is a sample contet
  # @scf-region sample-region

  And this is a region

  # @end-scf-region 
  
  # @scf-region another-sample-region

  And this is another region

  # @end-scf-region

  And here is a space after the region
  `

  // ACT
  const regions = regionProvider.getRegions(str)

  // ASSERT
  expect(regions.length).toBe(2)
  expect(regions[0].name).toBe('sample-region')
  expect(regions[1].name).toBe('another-sample-region')
})

test('Not started region', () => {
  // ARRANJE
  const regionProvider = new RegionProvider(new ConfigProvider())
  const str = `This is a sample contet

  # @end-scf-region 

  And here is a space after the region
  `

  // ACT
  expect(() => {
    regionProvider.getRegions(str)
  }).toThrowError()
})

test('Not finished region', () => {
  // ARRANJE
  const regionProvider = new RegionProvider(new ConfigProvider())
  const str = `This is a sample contet
  # @scf-region sample-region

  And this is a region


  And here is a space after the region
  `

  // ACT
  expect(() => {
    regionProvider.getRegions(str)
  }).toThrowError()
})
