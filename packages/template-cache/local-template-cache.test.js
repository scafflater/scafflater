/* eslint-disable no-undef */
const LocalTemplateCache = require('./local-template-cache')
const FileSystemUtils = require('fs-util')
const path = require('path')

jest.mock('fs-util')

describe('Github template source', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should copy to the local folder', async () => {
    // ARRANJE
    const path = 'path/to/some/template'
    const config = {
      templateConfigFileName: 'the_template_condig.json',
      localStorageTemplatesPath: '/path/to/store/templates',
    }
    const localTemplateCache = new LocalTemplateCache(config)

    FileSystemUtils.getJson.mockReturnValue({name: 'some-name', version: 'some-version'})

    // ACT
    await localTemplateCache.storeTemplate(path)

    // ASSERT
    expect(FileSystemUtils.copy.mock.calls[0][0]).toBe(path)
    expect(FileSystemUtils.copy.mock.calls[0][1]).toBe('/path/to/store/templates/some-name/some-version')
  })

  test('Should list stored templates', async () => {
    // ARRANJE
    const config = {
      localStorageTemplatesPath: path.join(__dirname, '.test-resources/templates'),
    }
    const localTemplateCache = new LocalTemplateCache(config)

    FileSystemUtils.getDirTree.mockReturnValue({
      name: 'templates',
      children: [
        {
          name: 'tmpl-01',
          children: [
            {
              name: '1.0.0',
            },
            {
              name: '2.0.0',
            },
          ],
        },
        {
          name: 'tmpl-02',
          children: [
            {
              name: '3.0.0',
            },
          ],
        },
      ]})

    // ACT
    const out = await localTemplateCache.listCachedTemplates(path)

    // ASSERT
    expect(out.length).toBe(2)
    expect(out[0].versions.length).toBe(2)
    expect(out[0].versions[0].version).toBe('1.0.0')
    expect(out[0].versions[1].version).toBe('2.0.0')
  })
})
