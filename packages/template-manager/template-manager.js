const path = require('path')
const GitUtil = require('git-util/git-util')
const LocalConfigManager = require('./local-config-manager')
const fs = require('fs-extra')
const constants = require('./constants')
const TemplateSource = require('template-source')

const defaultConfig = {
  manager: 'fileSystem',
  managers: {
    fileSystem: './file-system-template-manager',
  },
}

/**
* Template Manager factory.
*/
class TemplateManager {
  /**
  * Template Manager constructor.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  */
  constructor(config = {}) {
    this.config = {...defaultConfig, ...config}
    this.templateSource = new TemplateSource(this.config)
  }

  /**
  * Returns the template ,anager instance to be used to manage templates.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  * @param {?string} manager - Manager to be used. If null, will use github as default.
  * @return {TemplateSource} An specialized instance of TemplateManager.
  */
  getTemplateManager(config = {}, manager = null) {
    const c = {...defaultConfig, ...config}
    const s = manager ? manager : c.manager

    if (!c.managers[s]) {
      throw new Error(`There's no module for manager '${s}'`)
    }

    const ts = new (require(c.managers[s]))(config)
    return ts
  }

  /**
  * Register an template from a sourceKey to be used
  * @param {string} sourceKey - The source key of template. Will vary, depending on template source
  * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
  */
  async registerTemplateFrom(sourceKey) {
    return this
    .getTemplateManager()
    .registerTemplateFrom(sourceKey)
  }

  static async getTemplateFromRemote(templateUrl) {
    const tempDir = await GitUtil.cloneToTempPath(templateUrl)
    // TODO: Validate template configuration
    const templateConfig = fs.readJsonSync(path.join(tempDir, constants.TEMPLATE_CONFIG_FILE_NAME))
    const templateFolder = await LocalConfigManager.getTemplateFolder(templateConfig)
    fs.moveSync(tempDir, templateFolder)

    // If is the first template, set it as in use
    if (this.getTemplateInUse() !== null) {
      this.setTemplateInUse(templateConfig.name, templateConfig.version)
    }
  }

  static async listTemplates() {
    return LocalConfigManager.listLocalTemplates()
  }

  static async getTemplateInUse() {
    const config = await LocalConfigManager.getConfig()
    return config.templateInUse
  }

  static async setTemplateInUse(name, version) {
    const config = await LocalConfigManager.getConfig()
    config.templateInUse = {
      name,
      version,
    }
    await LocalConfigManager.saveConfig(config)
  }

  static async applyTemplate(templatePath, component, destinPath) {

    // Load template config
    // Resolve componente. Se componente
    // Load component config
    // Efetuar o prompt dos parâmetros para o componente
    // Carregar directory tree do componente
    // Aplicar Handlebars na estrutura de pastas, criando esta estrutura no destinPath
    // Aplicar Handlebars nos arquivos, salvando-os no destinPath
    //    Verificar se há cabeçalho de configuração para append
  }
}

module.exports = TemplateManager
