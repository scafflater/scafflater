const TemplateSource = require('./template-source')
const GitUtil = require('git-util')
const FileSystemUtils = require('fs-util')

class GitTemplateSource extends TemplateSource {
  /**
  * Gets the template and copies it in a local folder.
  * @param {string} sourceKey - The source key (repository url) of template.
  * @param {?string} outputDir - Folder where template must be copied. If null, a temp folder will be used.
  * @return {string} Folder where the template was copied.
  */
  async getTemplateFrom(sourceKey, outputDir = null) {
    const out = outputDir ? outputDir : FileSystemUtils.getTempFolder()
    await GitUtil.clone(sourceKey, out)

    // TODO: Validate template configuration

    return out
  }
}

module.exports = GitTemplateSource
