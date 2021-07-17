const { Command, flags } = require("@oclif/command");
const TemplateManager = require("scafflater/template-manager");
const { listPartials } = require("../../util");
const fsUtil = require("scafflater/fs-util");
const path = require("path");
const logger = require("scafflater/logger");
const chalk = require("chalk");
const OptionsProvider = require("scafflater/options-provider");

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
      const manager = new TemplateManager(config);

      const partials = await listPartials(manager, config, listFlags.output);
      if (!partials || partials.length <= 0) {
        return;
      }

      logger.write(chalk.bold("\nPARTIALS"));
      partials.forEach((p) =>
        logger.write(`  ${p.config.name}\t${p.config.description ?? ""}`)
      );
      logger.write("");
    } catch (error) {
      logger.error(error);
    }
  }
}

ListPartialCommand.description = `Lists available partials in template
...
`;

ListPartialCommand.flags = {
  output: flags.string({
    char: "o",
    description: "The output folder",
    default: "./",
  }),
};

module.exports = ListPartialCommand;
