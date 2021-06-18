const {Command, flags} = require('@oclif/command')
const TemplateSource = require('scafflater/template-source')
const TemplateManager = require('scafflater/template-manager')
const TemplateCache = require('scafflater/template-cache')
const {promptMissingParameters, spinner} = require('../../util')
const FileSystemUtils = require('scafflater/fs-util')
const path = require('path')
const logger = require('scafflater/logger')
const chalk = require('chalk')

class ListPartialCommand extends Command {
  async run() {
    try {
      const {flags} = this.parse(ListPartialCommand)
      const outputInfoPath = path.join(flags.output, '_scf.json')
      if (!FileSystemUtils.pathExists(outputInfoPath)) {
        logger.error('The template is not initialized!')
        logger.error(`Run ${chalk.bold('init')} to initialize the template at the ${chalk.bold('output folder')} before working with partials!`)
        return
      }

      const source = new TemplateSource()
      const cache = new TemplateCache()
      const manager = new TemplateManager(source, cache)

      const outputInfo = FileSystemUtils.getJson(outputInfoPath)

      // Checking if the template is cached
      let cachePath = await cache.getTemplatePath(outputInfo.template.name, outputInfo.template.version)
      if (!cachePath) {
        // Caching template
        await spinner(`Getting template from ${outputInfo.template.source.key}`, async () => {
          await manager.getTemplateFromSource(outputInfo.template.source.key)
        })
        cachePath = await cache.getTemplatePath(outputInfo.template.name, outputInfo.template.version)
        if (!cachePath) {
          logger.error(`Cannot get template ${chalk.bold(outputInfo.template.name)} (version ${chalk.bold(outputInfo.template.version)}) on ${outputInfo.template.source.key}`)
          return
        }
      }

      let partials = await manager.listPartials(outputInfo.template.name, outputInfo.template.version)
      if (!partials) {
        logger.error(`No partials available on template ${chalk.bold(outputInfo.template.name)} (version ${chalk.bold(outputInfo.template.version)})`)
        return
      }

      console.log(chalk.bold('\nPARTIALS'))
      partials.forEach(p => console.log(`  ${p.config.name}\t${p.config.description}`))
      console.log('')   

    } catch (error) {
      logger.error(error)
    }
  }
}

ListPartialCommand.description = `Lists available partials in template
...
`

ListPartialCommand.flags = {
  output: flags.string({char: 'o', description: 'The output folder', default: './'})
}

module.exports = ListPartialCommand
