import { execSync } from 'child_process'

const __dirname = ((await import('path')).dirname)
  (((await import('url')).fileURLToPath)(import.meta.url))

export function xe({ context, action }) {
  execSync(`zx ${__dirname}/../scripts/${context}/${action}.mjs`)
}