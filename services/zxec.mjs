import path from 'path'
import { execSync } from 'child_process'

const __dirname = ((await import('path')).dirname)
  (((await import('url')).fileURLToPath)(import.meta.url))

export function zxec({ context, action, args }) {
  execSync(`zx ${path.join(__dirname, '..', 'scripts', context, action)}.mjs ${args}`)
}