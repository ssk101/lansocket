#!/usr/bin/env zx

// $.verbose = false

const { LANSOCKET_NAMESPACE, HOME } = process.env

const CFG_FILE = `${HOME}/barrier.conf`

const HOSTS = [
  'ubuntu-i3-home',
  'ubuntu-i3-work',
]

const CFG_TEMPLATE =
`section: screens
end

section: aliases
end

section: links
end

section: options
  relativeMouseMoves = false
  screenSaverSync = true
  win32KeepForeground = false
  clipboardSharing = true
  switchCorners = none
  switchCornerSize = 0
  serverhostname = REPLACEME
end
`

const MAX_TRIES = 10

async function wait(t = 1000) {
  await new Promise(r => setTimeout(() => r(), t))
}

async function getStatus(process) {
  try {
    const status = await $`/usr/bin/pgrep ${process} | wc -l`
    return +((status || '').toString().trim() || 0)
  } catch (e) {
    return 0
  }
}

async function getStatuses() {
  const summed = (await Promise.all([
    getStatus('barrier'),
    getStatus('barrierd'),
    getStatus('barrierc'),
  ])).reduce((a, b) => a + b, 0)

  console.log({ summed })
  return summed
}

async function killBarrier() {
  let curr = 0

  while(await getStatuses() > 0 && curr < MAX_TRIES) {
    curr += 1

    try {
      await $`killall barrier`
    } catch (e) {}
    try {
      await $`killall barrierd`
    } catch (e) {}
    try {
      await $`killall barrierc`
    } catch (e) {}

    await wait(1000)
  }
}

async function findHost() {
  for(const host of HOSTS) {
    let up

    try {
      up = !!(await $`nmap ${host} -PN -p ssh | grep open`).toString()
    } catch (e) {}

    if(up) return host
  }
}

async function startBarrier() {
  if(LANSOCKET_NAMESPACE === 'mbp') {
    await killBarrier()
    try {
      await $`/Applications/Barrier.app/Contents/MacOS/barrierc --name mbp --restart --disable-crypto --daemon ${foundHost}`
    } catch (e) {
      console.error(e)
    }
  }
}

const foundHost = await findHost()

if(!foundHost) {
  console.error('No host found')
  process.exit(1)
}

let configHost

try {
  const configContent = fs.readFileSync(CFG_FILE, 'utf8')
  configHost = configContent.match(/(?<=(serverhostname = ))(.*)/gm).toString().trim()

  if(configHost === foundHost) {
    console.log('Config host unchanged', { configHost, foundHost })
  } else {
    const config = CFG_TEMPLATE.replace(/REPLACEME/gm, foundHost)
    fs.writeFileSync(CFG_FILE, config, 'utf8')
    await startBarrier()
  }
} catch (e) {
  console.error(e)
  process.exit(0)
}

