/* eslint-disable no-undef */
const FileSystemUtils = require('fs-util')
const Generator = require('./generator')

jest.mock('fs-util')

describe('Generator Tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  test('Render a simple file', async () => {
    // ARRANJE
    FileSystemUtils.getDirTree.mockReturnValue({
      path: 'just/a/sample/test.txt',
      name: 'test.txt',
      size: 100,
      type: 'file',
      extension: '.txt',
    })
    FileSystemUtils.getFile.mockReturnValue('{{parameters.test}}')
    const ctx = {
      sourcePath: '/source/path',
      targetPath: '/target/path',
      parameters: {test: 'a sample test'},
    }

    // ACT
    await Generator.generate(ctx)

    // ASSERT
    expect(FileSystemUtils.saveFile.mock.calls.length).toBe(1)
    expect(FileSystemUtils.saveFile.mock.calls[0][0]).toBe('/target/path/test.txt')
    expect(FileSystemUtils.saveFile.mock.calls[0][1]).toBe('a sample test')
  })

  test('Render parameters in th folder and file paths', async () => {
    // ARRANJE
    FileSystemUtils.getDirTree.mockReturnValue(
      {
        path: 'the-partial-folder', // must be ignored
        name: 'the-partial-folder',
        size: 200,
        type: 'directory',
        children: [{
          path: '{{parameters.folderName}}',
          name: '{{parameters.folderName}}',
          size: 200,
          type: 'directory',
          children: [{
            path: '{{parameters.folderName}}/{{parameters.fileName}}.txt',
            name: '{{parameters.fileName}}.txt',
            size: 100,
            type: 'file',
            extension: '.txt',
          }],
        }],
      })
    FileSystemUtils.getFile.mockReturnValue('{{parameters.test}}')
    const ctx = {
      sourcePath: '/source/path',
      targetPath: '/target/path',
      parameters: {
        test: 'a sample test',
        folderName: 'folder-name',
        fileName: 'file-name',
      },
    }

    // ACT
    await Generator.generate(ctx)

    // ASSERT
    expect(FileSystemUtils.saveFile.mock.calls.length).toBe(1)
    expect(FileSystemUtils.saveFile.mock.calls[0][0]).toBe('/target/path/folder-name/file-name.txt')
    expect(FileSystemUtils.saveFile.mock.calls[0][1]).toBe('a sample test')
  })

  test('Does not render empty paths', async () => {
    // ARRANJE
    FileSystemUtils.getDirTree.mockReturnValue(
      {
        path: '{{parameters.folderName}}',
        name: '{{parameters.folderName}}',
        size: 200,
        type: 'directory',
        children: [{
          path: '{{parameters.folderName}}/{{parameters.fileName}}.txt',
          name: '{{parameters.fileName}}.txt',
          size: 100,
          type: 'file',
          extension: '.txt',
        },
        {
          path: '{{parameters.folderName}}/{{#if parameters.shouldRenderFile}}{{parameters.fileName}}.txt{{/if}}',
          name: '{{#if parameters.shouldRenderFile}}{{parameters.fileName}}.txt{{/if}}',
          size: 100,
          type: 'file',
          extension: '.txt',
        },
        {
          path: '{{parameters.folderName}}/{{#if parameters.shouldRenderFolder}}another-folder{{/if}}',
          name: '{{#if parameters.shouldRenderFolder}}another-folder{{/if}}',
          size: 200,
          type: 'directory',
          children: [{
            path: '{{parameters.folderName}}/{{#if parameters.shouldRenderFolder}}another-folder{{/if}}/file.txt',
            name: 'file.txt',
            size: 100,
            type: 'file',
            extension: '.txt',
          }],
        }],
      })
    FileSystemUtils.getFile.mockReturnValue('{{parameters.test}}')
    const ctx = {
      sourcePath: '/source/path',
      targetPath: '/target/path',
      parameters: {
        test: 'a sample test',
        folderName: 'folder-name',
        fileName: 'file-name',
        shouldRenderFolder: false,
        shouldRenderFile: false,
      },
    }

    // ACT
    await Generator.generate(ctx)

    // ASSERT
    expect(FileSystemUtils.saveFile.mock.calls.length).toBe(1)
    expect(FileSystemUtils.saveFile.mock.calls[0][0]).toBe('/target/path/folder-name/file-name.txt')
    expect(FileSystemUtils.saveFile.mock.calls[0][1]).toBe('a sample test')
  })
})
