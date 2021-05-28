
const defaultConfig = {
  source: 'github',
  sources: {
    github: './git-template-source',
  },
}

/**
* TemplateSource factory.
*/
class TemplateSource {
  /**
  * Template Source constructor.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  */
  constructor(config = {}) {
    this.config = {...defaultConfig, ...config}
  }

  /**
  * Returns the template source instance to be used to get templates.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  * @param {?string} source - Source to be used. If null, will use github as default.
  * @return {TemplateSource} An specialized instance of TemplateSource.
  */
  getTemplateSource(config = {}, source = null) {
    const c = {...defaultConfig, ...config}
    const s = source ? source : c.source

    if (!c.sources[s]) {
      throw new Error(`There's no module for source '${s}'`)
    }

    const ts = new (require(c.sources[s]))(config)
    return ts
  }

  /**
  * Gets the template and copies it in a local folder.
  * @param {string} sourceKey - The source key of template. Will vary, depending on template source
  * @param {?string} outputDir - Folder where template must be copied. If null, a temp folder will be used.
  * @param {?object} config - Scafflater configuration
  * @return {string} Folder where the template was copied.
  */
  async getTemplateFrom(sourceKey, outputDir = null) {
    return this
    .getTemplateSource()
    .getTemplateFrom(sourceKey, outputDir)
  }
}

module.exports = TemplateSource
