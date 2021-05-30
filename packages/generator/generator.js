const path = require('path')
const Handlebars = require('handlebars')
const FileSystemUtils = require('fs-util')

const ignoredFiles = ['_scf.json']
const ignoredFolders = ['_partials, _hooks']

class Generator {
  static async generate(ctx, tree = null) {
    if (!tree)
      tree = FileSystemUtils.getDirTree(ctx.sourcePath)

    const targetName = this.compileAndApply(ctx, tree.name).trim()
    if (targetName === '') {
      return
    }

    const promisses = []
    if (tree.type === 'directory' && !ignoredFolders.indexOf(tree.name) >= 0) {
      for (const child of tree.children) {
        const _ctx = {
          ...ctx,
          ...{
            sourcePath: path.join(ctx.sourcePath, tree.name),
            targetPath: path.join(ctx.targetPath, targetName),
          },
        }
        promisses.push(this.generate(_ctx, child))
      }
    }

    if (tree.type === 'file' && !ignoredFiles.indexOf(tree.name) >= 0) {
      const fileContent = this.compileAndApply(ctx, FileSystemUtils.getFile(path.join(ctx.sourcePath, tree.name)))
      promisses.push(FileSystemUtils.saveFile(path.join(ctx.targetPath, targetName), fileContent))
    }

    await Promise.all(promisses)
  }

  static compileAndApply(ctx, templateStr) {
    return Handlebars.compile(templateStr)(ctx)
  }
}

module.exports = Generator
