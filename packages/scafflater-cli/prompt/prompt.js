const inquirer = require('inquirer')
const regexValidate = require('./validators/regex')

/**
* Class to prompt user
*/
class Prompt {
  /**
  * Prompts the user values the questions in config.prompt.
  * @param {object} answers - Contains values of already answered questions. Inquirer will avoid asking answers already provided here. Defaults {}.
  * @return {object} Answers.
  */
  static async prompt(questions, answers = {}) {
    questions = questions.map(q => {
      if (!q.regex)
        return q

      return { ...q, validate: (input) => { return regexValidate(q, input) } }
    })

    return inquirer.prompt(questions, answers)
  }
}

module.exports = Prompt
