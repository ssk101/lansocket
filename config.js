import os from 'os'
import fs from 'fs'

const { HOME } = process.env
const userCfgPath = `${HOME}/.lansocketrc`
let userCfg

try {
  userCfg = JSON.parse(fs.readFileSync(userCfgPath))
} catch (e) {
  console.error(e)
  process.exit(0)
}

if(!userCfg?.hosts?.length) {
  console.error(`Hosts not configured in ${HOME}/.lansocketrc`)
  process.exit(0)
}

export default Object.assign({
  localHostname: os.hostname(),
  port: 6660,
  wsPort: 6661,
}, userCfg)
