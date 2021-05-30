const TemplateSource = require('template-source')
const TemplateCache = require('template-cache')
const TemplateManager = require('template-manager')

/**
* Scafflater class
*/
class Scafflater {
  /**
  * Scafflater constructor.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  * @param {string} sourceKey - The source key
  */
  constructor(config = {}, sourceKey = null) {
    this.config = config
    this.templateSource = new TemplateSource(this.config, sourceKey)
    this.templateCache = new TemplateCache(this.config)
    this.templateManager = new TemplateManager(this.templateSource, this.templateCache)
  }

  /**
  * Initializes the basic structure for this scafflater template.
  * @param {string} sourceKey - Source Template key
  * @param {string} targetPath - Path where the results must be placed
  * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
  */
  async init(sourceKey, targetPath = './') {
    const templateConfig = await this.templateManager.getTemplateFromSource(sourceKey)
    const initPartialInfo = await this.templateManager.getPartial('_init', templateConfig.name, templateConfig.version)
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

module.exports = Scafflater
