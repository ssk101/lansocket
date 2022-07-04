import os from 'os'
import fs from 'fs'
import path from 'path'
const __dirname = ((await import('path')).dirname)(((await import('url')).fileURLToPath)(import.meta.url))

const userCfgPath = path.join(__dirname, '.lansocketrc')
let userCfg

try {
  userCfg = JSON.parse(fs.readFileSync(userCfgPath))
} catch (e) {
  console.error(e)
  process.exit(0)
}

if(!userCfg?.hosts?.length) {
  console.error(`Hosts not configured in ${userCfgPath}`)
  process.exit(0)
}

export default Object.assign({
  __dirname,
  localHostname: os.hostname(),
  port: 6660,
  wsPort: 6661,
  hosts: [],
  services: {
    barrier: {},
  },
}, userCfg)
