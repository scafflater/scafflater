const {Command, flags} = require('@oclif/command')
const TemplateSource = require('template-source')
const Scafflater = require('scafflater')
const TemplateManager = require('template-manager')
const TemplateCache = require('template-cache')
const {promptMissingParameters} = require('../util')
const FileSystemUtils = require('fs-util')
const path = require('path')

class InitCommand extends Command {
  async run() {
    if (FileSystemUtils.pathExists(flags.output, '_scf.json')) {
      return
    }

    const {args, flags} = this.parse(InitCommand)

    const source = new TemplateSource()
    const cache = new TemplateCache()
    const manager = new TemplateManager(source, cache)

    const templateConfig = await manager.getTemplateFromSource(args.Git_Hub_Repository)

    const initConfig = await manager.getPartial('_init', templateConfig.name, templateConfig.version)

    const parameters = await promptMissingParameters(flags.parameters, initConfig.config.parameters)

    const scafflater = new Scafflater()
    await scafflater.init(args.Git_Hub_Repository, parameters, flags.output)

    this.log(flags)
    // this.log(JSON.parse(flags.parameters))
    this.log(templateConfig)
    this.log(initConfig)
    this.log(parameters)
  }
}

InitCommand.description = `Initializes the template in a output folder
...
Extra documentation goes here
`

InitCommand.args = [
  {name: 'Git_Hub_Repository', require: true},
]

InitCommand.flags = {
  output: flags.string({char: 'o', description: 'The output folder', default: './'}),
  parameters: flags.string({char: 'p', description: 'The parameters to init template', default: [], multiple: true}),
}

module.exports = InitCommand
