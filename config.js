import _ from 'lodash'

const defaults = {
  port: 3099,
}

let devConfig

try {
  ({ default: devConfig } = await import('./development.js'))
} catch (e) {}

export default _.merge(defaults, devConfig)