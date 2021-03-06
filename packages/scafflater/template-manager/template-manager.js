const { ScafflaterOptions } = require("../options");
const {
  LocalTemplate,
  LocalPartial,
} = require("../scafflater-config/local-template");
const Source = require("../scafflater-config/source");
const { TemplateCache } = require("../template-cache");
const { TemplateSource } = require("../template-source");

/**
 * Template Manager factory
 */
class TemplateManager {
  /**
   *
   * @param {TemplateCache} cache - The template cache storage
   * @param {TemplateSource} source - The template source
   * @param {ScafflaterOptions} options The Scafflater options
   */
  constructor(cache, source, options) {
    this.templateCache = cache;
    this.templateSource = source;
    this.options = new ScafflaterOptions(options);
  }

  /** @constant {TemplateSource} */
  templateSource;
  /** @constant {TemplateCache} */
  templateCache;

  /**
   * Gets a TemplateManager from scafflater options
   *
   * @param {ScafflaterOptions} options The Scafflater Options
   * @returns {TemplateManager} A template manager constructed based on options
   */
  static fromOptions(options) {
    const templateSource = TemplateSource.getTemplateSource(options);
    const templateCache = TemplateCache.getTemplateCache(options);

    return new TemplateManager(templateCache, templateSource, options);
  }

  /**
   * Gets the template from source and stores in the cache
   *
   * @param {string} sourceKey - Source key
   * @param {string} version - Template version
   * @returns {Promise<LocalTemplate>} An object containing template config
   */
  async getTemplateFromSource(sourceKey, version = "last") {
    const templateSource = TemplateSource.resolveTemplateSourceFromSourceKey(
      this.options,
      sourceKey
    );
    const tempTemplateFolder = await templateSource.getTemplate(
      sourceKey,
      version
    );
    return this.templateCache.storeTemplate(
      tempTemplateFolder.folderPath,
      version === "last" ? null : version
    );
  }

  /**
   * Gets the template path, if it is stored in the cache.
   *
   * @param {string} templateName Template name
   * @param {string} templateVersion Template Version. If null, the latest stored version is returned.
   * @param {Source} source The template source. If the template is not cached, use this to try getting the template from source.
   * @returns {Promise<LocalTemplate>} The cached template path. Returns null if the template is not in cache.
   */
  async getTemplate(templateName, templateVersion = "last", source = null) {
    const template = await this.templateCache.getTemplate(
      templateName,
      templateVersion
    );

    if (!template && source) {
      return this.getTemplateFromSource(source.key, templateVersion);
    }

    return Promise.resolve(template);
  }

  /**
   * Gets the partial path, if it is stored in the cache.
   *
   * @param {string} partialName - Partial name
   * @param {string} templateName - Template name
   * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
   * @returns {Promise<object>} Object containing the config and the path to partial.
   */
  async getPartial(partialName, templateName, templateVersion = "last") {
    const partials = await this.listPartials(templateName, templateVersion);

    if (!partials) {
      return Promise.resolve(null);
    }

    const partial = partials.find((p) => p.name === partialName);

    if (!partial) {
      return Promise.resolve(null);
    }

    return Promise.resolve(partial);
  }

  /**
   * List available partials in template.
   *
   * @param {string} templateName - Template name
   * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
   * @returns {Promise<LocalPartial[]>} Array of objects containing the config and the path to partial.
   */
  async listPartials(templateName, templateVersion = "last") {
    const template = await this.templateCache.getTemplate(
      templateName,
      templateVersion
    );
    if (!template) {
      return Promise.resolve(null);
    }

    return Promise.resolve(template.partials);
  }
}

module.exports = TemplateManager;
