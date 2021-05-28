/* eslint-disable no-undef */
const FileSystemUtils = require('./fs-util')
const path = require('path')

test('Should return the directory tree without files', () => {
  // ARRANJE
  const folderPath = path.join(__dirname, '.test-resources')

  // ACT
  const out = FileSystemUtils.getDirTree(folderPath, false)

  // ASSERT
  expect(out.children.length).toBe(1)
  expect(out.children[0].type).toBe('directory')
})

test('Should return the directory tree with files', () => {
  // ARRANJE
  const folderPath = path.join(__dirname, '.test-resources')

  // ACT
  const out = FileSystemUtils.getDirTree(folderPath)

  // ASSERT
  expect(out.children.length).toBe(2)
})
