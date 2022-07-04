#!/usr/bin/env zx

import 'zx/globals'
import path from 'path'
import config from '../../config.js'
import { cmd } from '../../services/cmd.mjs'

export async function connect() {
  const {
    hosts,
    services = {},
    localHostName,
    verbose,
  } = config

  const { role, executablePath, executableName } = services.barrier || {}

  if(role === 'server' || !role || !executablePath || !executableName) {
    return {}
  }

  const executable = path.join(executablePath, executableName)

  $.verbose = verbose

  const MAX_KILL_TRIES = 10

  async function wait(t = 1000) {
    await new Promise(r => setTimeout(() => r(), t))
  }

  async function getProcessStatus() {
    try {
      const status = await $`/usr/bin/pgrep ${executableName} | wc -l`
      return +((status || '').toString().trim())
    } catch (e) {
      return 0
    }
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
        console.error('nmap', e)
      }

      if(up?.match(/tcp(\s*)open/g)) {
        console.log('found a host', { host })
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

  console.log({processHost, foundHost})

  if(processHost !== foundHost) {
    await killBarrier()

    try {
      await cmd(executable, [
        '--restart',
        '--daemon',
        foundHost,
      ])
    } catch (e) {
      console.error(e)
    }

    console.log(3)
  }

  return { processHost, newHost: foundHost }
}