const { Command, flags } = require("@oclif/command");
const Scafflater = require("scafflater");
const TemplateSource = require("scafflater/template-source");
const { promptMissingParameters, spinner } = require("../util");
const fsUtil = require("scafflater/fs-util");
const path = require("path");
const logger = require("scafflater/logger");
const OptionsProvider = require("scafflater/options-provider");

class InitCommand extends Command {
  async run() {
    try {
      const { args: iniArgs, flags: initFlags } = this.parse(InitCommand);

      const config = {
        ...new OptionsProvider(),
        ...{
          cacheStorage: initFlags.cache,
        },
      };
      config.source = TemplateSource.resolveTemplateSourceFromSourceKey(
        config,
        iniArgs.source
      );
      const scafflater = new Scafflater(config);

      if (
        fsUtil.pathExistsSync(path.join(initFlags.output, config.scfFileName))
      ) {
        logger.info("The output folder is initialized!");
        logger.info("Aborting!");
        return;
      }

      let templateConfig;
      await spinner(`Getting template from ${iniArgs.source}`, async () => {
        templateConfig = await scafflater.templateManager.getTemplateFromSource(
          iniArgs.source
        );
      });

      const parameters = await promptMissingParameters(
        initFlags.parameters,
        templateConfig.parameters
      );

      await spinner("Running template initialization", async () => {
        await scafflater.init(iniArgs.source, parameters, initFlags.output);
      });

      logger.log(
        "notice",
        "Template initialized. Fell free to run partials. 🥳"
      );
    } catch (error) {
      logger.error(error);
    }
  }
}

InitCommand.description = `Initializes the template in a output folder
...
`;

InitCommand.args = [{ name: "source", require: true }];

const caches = ["homeDir", "tempDir"];
InitCommand.flags = {
  output: flags.string({
    char: "o",
    description: "The output folder",
    default: "./",
  }),
  cache: flags.string({
    char: "c",
    description: "The cache strategy",
    default: "homeDir",
    options: caches,
  }),
  parameters: flags.string({
    char: "p",
    description: "The parameters to init template",
    default: [],
    multiple: true,
  }),
};

module.exports = InitCommand;
