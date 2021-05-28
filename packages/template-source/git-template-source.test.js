/* eslint-disable no-undef */
const GitTemplateSource = require('./git-template-source')
const GitUtil = require('git-util')
const FileSystemUtils = require('fs-util')

jest.mock('git-util')
jest.mock('fs-util')

describe('Github template source', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should clone to the folder in parameter', async () => {
    // ARRANJE
    const repo = 'some/repo'
    const virtualFolder = 'some/virtual/folder'
    const gitTemplateSource = new GitTemplateSource()

    // ACT
    const out = await gitTemplateSource.getTemplateFrom(repo, virtualFolder)

    // ASSERT
    expect(out).toBe(virtualFolder)
    expect(GitUtil.clone.mock.calls[0][0]).toBe(repo)
    expect(GitUtil.clone.mock.calls[0][1]).toBe(virtualFolder)
  })

  test('Should clone to a temp folder', async () => {
    // ARRANJE
    const repo = 'some/repo'
    const tempFolder = 'some/temp/folder'
    const gitTemplateSource = new GitTemplateSource()

    FileSystemUtils.getTempFolder.mockReturnValue(tempFolder)

    // ACT
    const out = await gitTemplateSource.getTemplateFrom(repo)

    // ASSERT
    expect(out).toBe(tempFolder)
    expect(GitUtil.clone.mock.calls[0][0]).toBe(repo)
    expect(GitUtil.clone.mock.calls[0][1]).toBe(tempFolder)
  })
})
