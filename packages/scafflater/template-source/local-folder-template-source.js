const TemplateSource = require("./");
const fsUtil = require("../fs-util");
const path = require("path");
const OptionsProvider = require("../options-provider");

class LocalFolderTemplateSource extends TemplateSource {
  /**
   * Checks if the sourceKey is valid for this TemplateSource
   * @param {string} sourceKey - The source key to be validated.
   * @return {boolean} Returns true if the key is valid
   */
  static isValidSourceKey(sourceKey) {
    return fsUtil.existsSync(sourceKey);
  }
  /**
   * Template Source constructor.
   * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
   */
  constructor(config = {}) {
    config = { ...new OptionsProvider(), ...config };
    super(config);
  }

  /**
   * Gets the template and copies it in a local folder.
   * @param {string} sourceKey - The source key (<OWNER>/<REPOSITORY>) of template.
   * @param {?string} outputDir - Folder where template must be copied. If null, a temp folder will be used.
   * @return {object.path} Path where the template was copied.
   * @return {object.config} The template config.
   */
  async getTemplate(sourceKey, outputDir = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const out = outputDir ? outputDir : await fsUtil.getTempFolder();
        await fsUtil.copy(sourceKey, out);
        const config = await fsUtil.readJSON(path.join(out, ".scafflater"));

        // TODO: Validate template configuration

        resolve({
          path: out,
          config: {
            name: config.name,
            version: config.version,
            source: {
              name: "localFolder",
              key: sourceKey,
            },
            parameters: config.parameters,
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = LocalFolderTemplateSource;
