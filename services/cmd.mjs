import logger from './logger.mjs'

export async function cmd(command, args = [], opts = {}) {
  const fullCmd = [command].concat(args)

  const { stdout } = await $`${fullCmd}`

  if(opts.verbose) {
    logger.info(`${command} stdout: `, stdout)
  }

  return stdout
}