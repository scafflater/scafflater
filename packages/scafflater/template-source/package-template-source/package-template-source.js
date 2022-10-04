const { LocalFolderTemplateSource } = require("..");
const util = require("util");
const fs = require("fs-extra");
const exec = util.promisify(require("child_process").exec);
const ScafflaterFileNotFoundError = require("../../errors/scafflater-file-not-found-error");
const { TemplateDefinitionNotFound } = require("../../errors");
const logger = require("winston");
const fsUtil = require("../../fs-util");

/**
 * Gets the template and copies it in a local folder.
 *
 * @param {string} sourceKey - The source key of template. Will vary, depending on template source
 * @param {?string} outputDir - Folder where template must be copied. If null, a temp folder will be used.
 * @returns {Promise<LocalTemplate>} The local template
 */
class PackageTemplateSource extends LocalFolderTemplateSource {
  async getTemplate(sourceKey, outputDir = null) {
    try {
      const tempPath = fsUtil.getTempFolderSync();

      const packageStatus = await exec(`cd ${tempPath} && npm pack ${sourceKey}`, {
        timeout: 30000,
      });

      await exec(
        `cd ${tempPath} && tar -xvzf ${packageStatus.stdout.replace("/n", "")}`,
        {
          timeout: 30000,
        }
      );

      await exec(`cd ${tempPath}/package && npm install -D ${sourceKey}`, {
        timeout: 60000,
      });

      const pathToClone = `${tempPath}/package`;

      return await super.getTemplate(pathToClone, outputDir);
    } catch (error) {
      if (error instanceof ScafflaterFileNotFoundError) {
        throw new ScafflaterFileNotFoundError(
          `${sourceKey}/.scafflater/scafflater.jsonc`
        );
      }
      if (error instanceof TemplateDefinitionNotFound) {
        throw new TemplateDefinitionNotFound(
          `${sourceKey}/.scafflater/scafflater.jsonc`
        );
      }
      throw error;
    }
  }

  static async isValidSourceKey(sourceKey) {
    try {
      await exec(`npm view ${sourceKey}`, {
        timeout: 30000,
      });
      return true;
    } catch (error) {
      if (error.message.includes("404")) {
        return false;
      }
      logger.error(error.message);
    }
  }
}

module.exports = PackageTemplateSource;
