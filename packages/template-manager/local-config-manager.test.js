/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-undef */
const fs = require('fs-extra')
const LocalConfigManager = require('./local-config-manager')

jest.mock('fs-extra')

describe('Template Manager tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('Load inexisting config, creating an default', async () => {
    // ARRANJE
    jest.spyOn(fs, 'pathExists').mockImplementation(async () => {
      return false
    })
    const mockedConfig = {version: '0.0.0', templates: []}
    jest.spyOn(fs, 'readJson').mockImplementation(async () => {
      return mockedConfig
    })

    // ACT
    const config = await LocalConfigManager.getConfig()

    // ASSERT
    expect(config).toEqual(mockedConfig)
    expect(fs.writeJson.mock.calls.length).toBe(1)
  })

  test('Load existing config', async () => {
    // ARRANJE
    jest.spyOn(fs, 'pathExists').mockImplementation(async () => {
      return true
    })
    const mockedConfig = {version: '1.2.3', templates: []}
    jest.spyOn(fs, 'readJson').mockImplementation(async () => {
      return mockedConfig
    })

    // ACT
    const config = await LocalConfigManager.getConfig()

    // ASSERT
    expect(config).toEqual(mockedConfig)
    expect(fs.writeJson.mock.calls.length).toBe(0)
  })
})
