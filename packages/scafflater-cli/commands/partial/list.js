const { Command, flags } = require("@oclif/command");
const { listPartials } = require("../../util");
const fsUtil = require("scafflater/fs-util");
const path = require("path");
const logger = require("scafflater/logger");
const chalk = require("chalk");
const OptionsProvider = require("scafflater/options-provider");
const Scafflater = require("scafflater");

class ListPartialCommand extends Command {
  async run() {
    try {
      const { flags: listFlags } = this.parse(ListPartialCommand);

      const config = {
        ...new OptionsProvider(),
        ...{
          cacheStorage: listFlags.cache,
        },
      };
      const outputInfoPath = path.join(listFlags.output, config.scfFileName);
      const outputInfo = await fsUtil.readJSON(outputInfoPath);
      config.source = outputInfo.template.source.name;

      const scafflater = new Scafflater(config);

      const partials = await listPartials(
        scafflater.templateManager,
        config,
        listFlags.output
      );
      if (!partials || partials.length <= 0) {
        return;
      }

      logger.print(chalk.bold("\nPARTIALS"));
      partials.forEach((p) =>
        logger.print(`  ${p.config.name}\t${p.config.description ?? ""}`)
      );
      logger.print("");
    } catch (error) {
      logger.error(error);
    }
  }
}

ListPartialCommand.description = `Lists available partials in template
...
`;

const caches = ["homeDir", "tempDir"];
ListPartialCommand.flags = {
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
};

module.exports = ListPartialCommand;
