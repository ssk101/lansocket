import _ from 'lodash'

const defaults = {
  ws: {
    host: 'http://localhost',
    port: 3099,
  },
  server: {
    host: 'http://localhost',
    port: 3098,
  },
  clients: [

  ],
  namespace: '',
}

let devConfig

try {
  ({ default: devConfig } = await import('./development.js'))
} catch (e) {}

export default _.merge(defaults, devConfig)