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
  * @param {string} sourceKey - Teh source key
  */
  constructor(config = {}, sourceKey = null) {
    this.config = config
    this.templateSource = new TemplateSource(this.config, sourceKey)
    this.templateCache = new TemplateCache(this.config)
    this.templateManager = new TemplateManager(this.templateSource, this.templateCache)
  }

  async init(path = './') {

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
