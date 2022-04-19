import Bree from 'bree'
import Graceful from '@ladjs/graceful'
const __dirname = ((await import('path')).dirname)
  (((await import('url')).fileURLToPath)(import.meta.url))

const bree = new Bree({
  jobs: [
    {
      name: 'barrier-connect.mjs',
      interval: 'every 60 seconds',
      timeout: 0,
    },
  ],
})

const graceful = new Graceful({ brees: [bree] })
graceful.listen()
bree.start()