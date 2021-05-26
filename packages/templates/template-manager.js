const path = require('path')
const GitUtil = require('git-util/git-util')
const LocalConfigManager = require('./local-config-manager')
const fs = require('fs-extra')
const constants = require('./constants')

/**
* Class to manage templates
*/
class TemplateManager {
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
