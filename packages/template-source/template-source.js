
const defaultConfig = {
  source: 'github',
  sources: {
    github: './git-template-source',
  },
}

/** Known Sources used to detect sources from source keys patterns */
const knownSources = [
  {
    regex: /https?:\/\/github.com/g,
    source: 'github',
  },
]

/**
* TemplateSource factory.
*/
class TemplateSource {
  /**
  * Template Source constructor.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  * @param {string} sourceKey - Teh source key
  */
  constructor(config = {}, sourceKey = null) {
    this.config = {...defaultConfig, ...config}

    if (sourceKey) {
      for (const knownSource of knownSources) {
        if (knownSource.regex.test(sourceKey)) {
          this.config = {...this.config, ...{source: knownSource.source}}
        }
      }
    }
  }

  /**
  * Returns the template source instance to be used to get templates.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  * @return {TemplateSource} An specialized instance of TemplateSource.
  */
  getTemplateSource() {
    if (!this.config.sources[this.config.source]) {
      throw new Error(`There's no module for source '${this.config.source}'`)
    }

    const ts = new (require(this.config.sources[this.config.source]))(this.config)
    return ts
  }

  /**
  * Gets the template and copies it in a local folder.
  * @param {string} sourceKey - The source key of template. Will vary, depending on template source
  * @param {?string} outputDir - Folder where template must be copied. If null, a temp folder will be used.
  * @return {string} Folder where the template was copied.
  */
  async getTemplateFrom(sourceKey, outputDir = null) {
    return this
    .getTemplateSource()
    .getTemplateFrom(sourceKey, outputDir)
  }
}

module.exports = TemplateSource
