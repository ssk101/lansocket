import path from 'path'
import { execSync } from 'child_process'
import config from '../config.js'

export function zxec({ context, action, args }) {
  execSync(
    `zx ${path.join(
      config.__dirname,
      '..',
      'scripts',
      context,
      action
    )}.mjs ${args}`
  )
}