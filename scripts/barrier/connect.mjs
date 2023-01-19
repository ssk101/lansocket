#!/usr/bin/env zx

import 'zx/globals'
import config from '../../config.js'
import { cmd } from '../../services/cmd.mjs'
import { Logger } from '../../services/logger.mjs'

const logger = new Logger({ prefix: '[scripts/connect]' })

export async function connect() {
  const {
    hosts,
    services = {},
    localHostName,
    verbose,
  } = config

  $.verbose = verbose

  const { role, executablePath, executableName } = services.barrier || {}

  if(role === 'server' || !role || !executablePath || !executableName) {
    return {}
  }

  const executable = path.join(executablePath, executableName)
  const MAX_KILL_TRIES = 10

  async function wait(t = 1000) {
    await new Promise(r => setTimeout(() => r(), t))
  }

  async function getProcessStatus() {
    try {
      const status = await $`/usr/bin/pgrep ${executableName} | wc -l`
      logger.info('process status', { executableName, status })
      return +((status || '').toString().trim())
    } catch (e) { return -1 }
  }

  async function getProcessHost() {
    try {
      const host = await $`/bin/ps -ax | grep "[b]arrier"`

      return host
        .toString()
        .trim()
        .split(' ')
        .pop()

    } catch (e) {
      return
    }
  }

  async function killBarrier() {
    let i = 0

    if(await getProcessStatus() < 0) return true

    while(await getProcessStatus() > 0 && i < MAX_KILL_TRIES) {
      i += 1

      try {
        await cmd('killall', ['barrier', 'barrierc'])
      } catch (e) {}

      await wait(1000)
    }
  }

  async function findHost() {
    for(const host of hosts) {
      logger.info('nmapping host:', host)

      if(host === localHostName) continue

      let up

      try {
        up = (await cmd('nmap', [
          host,
          '-PN',
          '-p',
          'ssh,msrpc',
        ])).toString()
      } catch (e) {
        logger.error('nmap error!', e)
      }

      if(up?.match(/tcp(\s*)open/g)) {
        logger.info('nmapped host matched', { host, up })
        return host
      }
    }
  }

  const foundHost = await findHost()

  if(!foundHost) {
    logger.warn('No host found')
    await killBarrier()
    logger.warn('Barrier killed')
    return { newhost: null }
  }

  logger.info('Getting Process Host')

  const processHost = await getProcessHost()

  logger.info('Got Process Host', processHost)

  const serverHostChanged = processHost !== foundHost

  if(processHost !== foundHost) {
    await killBarrier()

    fs.ensureDirSync(`${os.homedir()}/barrier_logs`)

    try {
      await cmd(executable, [
        '--restart',
        '--daemon',
        '--debug',
        'DEBUG',
        '--enable-drag-drop',
        '--enable-crypto',
        '--log',
        `${os.homedir()}/barrier_logs/barrierc_${Date.now()}.log`,
        foundHost,
      ])
    } catch (e) {
      logger.error(e)
      return { newHost: null }
    }

  }

  logger.info('Connecting to host:', foundHost)

  return { processHost, newHost: foundHost }
}