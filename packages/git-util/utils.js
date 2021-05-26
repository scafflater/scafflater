const {spawn} = require('child_process')
const {PassThrough} = require('stream')

/**
 *
 * @param {string} command the command to run
 * @param {string[]} args the arguments to pass the command
 * @param {stream} logStream the log streamer to capture log messages
 */
const runCommand = async (
  command,
  args,
  logStream = new PassThrough(),
) => {
  await new Promise((resolve, reject) => {
    const process = spawn(command, args)

    process.stdout.on('data', stream => {
      logStream.write(stream)
    })

    process.stderr.on('data', stream => {
      logStream.write(stream)
    })

    process.on('error', error => {
      return reject(error)
    })

    process.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`Command ${command} failed, exit code: ${code}`))
      }
      return resolve()
    })
  })
}

module.exports = {
  runCommand,
}
