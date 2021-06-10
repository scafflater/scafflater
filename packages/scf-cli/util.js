const inquirer = require('inquirer')

const parseParametersFlags = parameters => {
  const result = {}

  parameters.forEach(param => {
    let m =  /(?<name>.+)(?::)(?<value>.+)/g.exec(param)
    if (m.length <= 0)
      throw new Error('The parameters is not in the expected pattern: <parameter-name>:<parameter-value>')

    result[m.groups.name] =  m.groups.value
  })

  return result
}

const promptMissingParameters = async (parameterFlags, requireParameters) => {
  const flags = parseParametersFlags(parameterFlags)

  const missingParameters = []
  for (const rp of requireParameters) {
    if (!flags[rp.name])
      missingParameters.push(rp)
  }

  const prompt = missingParameters.length > 0 ? await inquirer.prompt(missingParameters) : {}

  return {...flags, ...prompt}
}

module.exports = {
  parseParametersFlags,
  promptMissingParameters,
}
