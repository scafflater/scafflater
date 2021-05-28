
const defaultConfig = {
  storage: 'local',
  storages: {
    local: './local-template-storage',
  },
}

/**
* TemplateStorage factory.
*/
class TemplateStorage {
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
  * @param {?string} storage - Storage to be used. If null, will use local as default.
  * @return {TemplateStorage} An specialized instance of TemplateStorage.
  */
  getTemplateStorage(config = {}, storage = null) {
    const c = {...defaultConfig, ...config}
    const s = storage ? storage : c.storage

    if (!c.storages[s]) {
      throw new Error(`There's no module for source '${s}'`)
    }

    const ts = new (require(c.storages[s]))(config)
    return ts
  }

  /**
  * Stores the template.
  * @param {string} path - Path of template
  */
  async storeTemplate(path) {
    return this
    .getTemplateStorage()
    .storeTemplate(path)
  }

  /**
  * Gets a template.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @param {string} path - Path to output the template If null, will store the template in a temp folder.
  * @returns {string} The path where template was copied
  */
  async getTemplateToPath(templateName, templateVersion = null, path = null) {
    return this
    .getTemplateStorage()
    .getTemplateToPath(templateName, templateVersion, path)
  }

  /**
  * List stored templates and their versions.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @param {string} path - Path to output the template If null, will store the template in a temp folder.
  */
  async listStoredTemplates() {
    return this
    .getTemplateStorage()
    .listStoredTemplates()
  }
}

module.exports = TemplateStorage
