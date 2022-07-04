#!/usr/bin/env zx

import 'zx/globals'
import config from '../../config.js'
import { cmd } from '../../services/cmd.mjs'

export async function connect() {
  const {
    hosts,
    services = {},
    localHostName,
  } = config

  const { role, executable } = services.barrier || {}

  if(role === 'server' || !role || !executable) {
    return {}
  }

  $.verbose = false

  const MAX_KILL_TRIES = 10

  async function wait(t = 1000) {
    await new Promise(r => setTimeout(() => r(), t))
  }

  async function getProcessStatus() {
    try {
      const status = await $`/usr/bin/pgrep barrierc | wc -l`
      return +((status || '').toString().trim())
    } catch (e) {
      return 0
    }
  }

  async function getProcessHost() {
    try {
      const host = await $`/bin/ps -ax | grep "[b]arrierc"`
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

    while(await getProcessStatus() > 0 && i < MAX_KILL_TRIES) {
      i += 1

      try {
        await cmd('killall', ['barrier'])
      } catch (e) {}
      try {
        await cmd('killall', ['barrierc'])
      } catch (e) {}

      await wait(1000)
    }
  }

  async function findHost() {
    for(const host of hosts) {
      if(host === localHostname) continue

      let up

      try {
        up = (await cmd('nmap', [
          host,
          '-PN',
          '-p',
          'ssh,msrpc',
          '|',
          'grep',
          `'open'`,
        ])).toString()
      } catch (e) {}

      if(up?.match(/tcp(\s*)open/g)) {
        console.log({ host })
        return host
      }
    }
  }

  const foundHost = await findHost()

  if(!foundHost) {
    await killBarrier()
    return { newhost: null }
  }

  const processHost = await getProcessHost()
  const serverHostChanged = processHost !== foundHost

  if(processHost !== foundHost) {
    await killBarrier()

    try {
      await cmd(barrierExecutable, [
        '--name',
        'mbp',
        '--restart',
        '--disable-crypto',
        '--daemon',
        foundHost,
      ])
    } catch (e) {
      console.error(e)
    }
  }

  return { processHost, newHost: foundHost }
}