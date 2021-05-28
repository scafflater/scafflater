const homedir = require('os').homedir()
const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const constants = require('./constants')
const sort = require('version-sort')
/**
* Class to manage local config and its directories
*/
class LocalConfigManager {
  /**
  * Gets config directory where config files and templates are stored locally
  */
  static async getConfigDir() {
    const configDir = path.join(homedir, constants.CONFIG_DIR_NAME)
    await fs.ensureDir(configDir)
    return configDir
  }

  /**
  * Gets scafolder cli config file path
  */
  static async getConfigPath() {
    return path.join(await this.getConfigDir(), constants.CONFIG_FILE_NAME)
  }

  /**
  * Gets scafolder cli config
  */
  static async getConfig() {
    const configPath = await this.getConfigPath()
    if (!(await fs.pathExists(configPath))) {
      await this.initConfig()
    }

    return fs.readJsonSync(configPath)
  }

  /**
  * Saves scaffolder cli config
  * @param {object} config Scaffolder cli config object
  */
  static async saveConfig(config) {
    const configPath = await this.getConfigPath()
    return fs.writeJsonSync(configPath, config)
  }

  /**
  * Initialize config. Will run when cli is executed for the first time
  */
  static async initConfig() {
    await fs.writeJSON(await this.getConfigPath(), this.getDefaultConfig())
  }

  /**
  * Builds scaffolder cli default config
  * @returns {object} The defult scaffolder cli default config
  */
  static getDefaultConfig() {
    var pjson = require('./package.json')
    return {
      version: pjson.version,
      templateInUse: null,
    }
  }

  /**
   *  Returns the template local path
   * @param {string} templateConfig The template configuration
   * @returns {string} The template local path
   */
  static async getTemplateFolder(templateConfig) {
    const configDir = await this.getConfigDir()
    return path.join(configDir, constants.TEMPLATES_DIR_NAME, templateConfig.name, templateConfig.version)
  }

  /**
   *  Returns the templates local path
   * @returns {string} The templates local path where templates are stored
   */
  static async getTemplatesFolder() {
    const templatesPath = path.join(await this.getConfigDir(), constants.TEMPLATES_DIR_NAME)
    await fs.ensureDir(templatesPath)
    return templatesPath
  }

  /**
   * Returns a temp folder path
   * @returns {string} A temp folder path
   */
  static getTempFolder() {
    return fs.mkdtempSync(os.tmpdir())
  }

  /**
   * List available local templates
   * @returns {object[]} An object array with templates names and versions
   */
  static async listLocalTemplates() {
    const templatesPath = await this.getTemplatesFolder()
    const templates = fs.readdirSync(templatesPath)
    // Removing Junk files, like like .DS_Store and Thumbs.db
    // eslint-disable-next-line no-useless-escape
    .filter(item => !(/(^|\/)\.[^\/\.]/g.test(item))).map(name => {
      return {name}
    })

    for (const template of templates) {
      const templateDir = path.join(templatesPath, template.name)
      template.versions = sort(fs.readdirSync(templateDir)).map(v => {
        return {version: v, inUse: false}
      })
    }

    const config = await this.getConfig()
    const template = templates.find(t => t.name === config.templateInUse.name)
    if (template)
      template.versions.find(v => v.version === config.templateInUse.version).inUse = true

    return templates
  }
}

module.exports = LocalConfigManager
