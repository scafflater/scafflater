/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-undef */
const TemplateManager = require('./template-manager')
const LocalConfigManager = require('./local-config-manager')
const Github = require('git-util/git-util')
const path = require('path')
const os = require('os')
const fs = require('fs-extra')
const constants = require('./constants')
const FileSystemTemplateManager = require('./file-system-template-manager')

jest.mock('../../packages/git-util/git-util')

describe('Template Manager tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('Throws an exception when the manager does not exists', () => {
    // ARRANJE
    const config = {manager: 'bla'}
    const tm = new TemplateManager()

    // ACT and ASSERT
    expect(() => {
      tm.getTemplateManager(config)
    }).toThrowError("There's no module for manager 'bla'")
  })

  test('Gets the Template Manager in config', () => {
    // ARRANJE
    const config = {manager: 'fileSystem'}
    const ts = new TemplateManager(config)

    // ACT
    const result = ts.getTemplateManager(config)

    // ASSERT
    // eslint-disable-next-line no-proto
    expect(result.__proto__ instanceof TemplateManager).toBe(true)
    expect(result instanceof FileSystemTemplateManager).toBe(true)
  })

  // OLD \/

  test('Get Template from url', async () => {
    // ARRANJE
    const tempConfigDir = fs.mkdtempSync(os.tmpdir())
    const samplePjson = fs.readJsonSync(path.join(__dirname, '../test-resources/template-sample/.gbcli-scf'))

    jest.spyOn(LocalConfigManager, 'getConfigDir').mockImplementation(async () => {
      return tempConfigDir
    })
    jest.spyOn(Github, 'cloneToTempPath').mockImplementation(async templateUrl => {
      const tempCloneDir = fs.mkdtempSync(os.tmpdir())
      await fs.copy(templateUrl, tempCloneDir, {recursive: true})
      return tempCloneDir
    })

    // ACT
    await TemplateManager.getTemplateFromRemote(path.join(__dirname, '../test-resources/template-sample'))

    // ASSERT
    expect(await fs.pathExists(path.join(tempConfigDir, constants.TEMPLATES_DIR_NAME, samplePjson.name, samplePjson.version))).toBe(true)
    expect(await fs.pathExists(path.join(tempConfigDir, constants.TEMPLATES_DIR_NAME, samplePjson.name, samplePjson.version, '.gbcli-scf'))).toBe(true)
    expect(await fs.pathExists(path.join(tempConfigDir, constants.TEMPLATES_DIR_NAME, samplePjson.name, samplePjson.version, 'templates'))).toBe(true)
  })

  test('List Templates', async () => {
    // ARRANJE
    const tempConfigDir = path.join(__dirname, '../test-resources/configdir-sample')

    jest.spyOn(LocalConfigManager, 'getConfigDir').mockImplementation(async () => {
      return tempConfigDir
    })

    // ACT
    const list = await TemplateManager.listTemplates()

    // ASSERT
    expect(list.length).toBe(2)
    expect(list[1].name).toBe('template-01')
    expect(list[1].versions.length).toBe(3)
    expect(list[1].versions[0].version).toBe('1.0.0')
    expect(list[1].versions[0].inUse).toBe(false)
    expect(list[1].versions[1].version).toBe('2.0.0')
    expect(list[1].versions[1].inUse).toBe(false)
    expect(list[1].versions[2].version).toBe('10.0.0')
    expect(list[1].versions[2].inUse).toBe(false)
    expect(list[0].name).toBe('sample-template')
    expect(list[0].versions[0].version).toBe('1')
    expect(list[0].versions[0].inUse).toBe(false)
    expect(list[0].versions[1].version).toBe('1.2.3.4')
    expect(list[0].versions[1].inUse).toBe(true)
  })
})
