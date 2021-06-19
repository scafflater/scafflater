/* eslint-disable no-undef */
const DirCache = require('./dir-cache')
const FileSystemUtils = require('../../fs-util')
const path = require('path')
const os = require('os')

jest.mock('../../fs-util')

describe('Github template source', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should copy to the local folder', async () => {
    // ARRANGE
    FileSystemUtils.getJson.mockReturnValue({name: 'some-name', version: 'some-version'})
    const path = 'path/to/some/template'
    const dirCache = new DirCache('path/to/some/template')

    // ACT
    await dirCache.storeTemplate(path)

    // ASSERT
    expect(FileSystemUtils.copy.mock.calls[0][0]).toBe(path)
    expect(FileSystemUtils.copy.mock.calls[0][1]).toBe('path/to/some/template/some-name/some-version')
  })

  test('List templates should list stored templates', async () => {
    // ARRANGE
    const dirCache = new DirCache('some/path')

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
      ],
    })

    // ACT
    const out = await dirCache.listCachedTemplates(path)

    // ASSERT
    expect(out.length).toBe(2)
    expect(out[0].versions.length).toBe(2)
    expect(out[0].versions[0].version).toBe('1.0.0')
    expect(out[0].versions[1].version).toBe('2.0.0')
  })

  test('List templates should return null if template folder does not exists', async () => {
    // ARRANGE
    const dirCache = new DirCache('some/path')

    FileSystemUtils.getDirTree.mockReturnValue(null)

    // ACT
    const out = await dirCache.listCachedTemplates(path)

    // ASSERT
    expect(out).toBe(null)
  })

  test('Get template folder should return null if template folder does not exists', async () => {
    // ARRANGE
    const dirCache = new DirCache('ome/path')
    const templateName = 'the-template'
    const templateVersion = 'the-template-version'

    FileSystemUtils.getDirTree.mockReturnValue(null)

    // ACT
    const out = await dirCache.getTemplateFolder(templateName, templateVersion)

    // ASSERT
    expect(out).toBe(null)
  })

  test('Get template folder should return null if theres no version for template', async () => {
    // ARRANGE
    const dirCache = new DirCache('some/path')
    const templateName = 'the-template'

    // ACT
    FileSystemUtils.getDirTree.mockReturnValue(null)
    const out = await dirCache.getTemplateFolder(templateName)
    FileSystemUtils.getDirTree.mockReturnValue({name: 'templates', children: []})
    const out2 = await dirCache.getTemplateFolder(templateName)

    // ASSERT
    expect(out).toBe(null)
    expect(out2).toBe(null)
  })
  
  test('Get template folder should return the version for the last template', async () => {
    // ARRANGE
    const dirCache = new DirCache('some/path')

    FileSystemUtils.getDirTree.mockReturnValue({
      name: 'tmpl-01',
      children: [
        {
          name: '1.0.0',
        },
        {
          name: '2.0.0',
        },
      ],
    })
    FileSystemUtils.pathExists.mockReturnValue(true)

    // ACT
    const out = dirCache.getTemplateFolder('tmpl-01')

    // ASSERT
    expect(out).toBe('some/path/tmpl-01/2.0.0')
  })
})
