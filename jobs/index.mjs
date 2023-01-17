import Bree from 'bree'
import Graceful from '@ladjs/graceful'
import config from '../config.js'
import path from 'path'

const jobs = []

if(config.services.barrier.role === 'client') {
  jobs.push({
    name: 'barrier-connect',
    // path: path.join(config.__dirname, 'jobs', 'barrier-connect.js'),
    interval: 'every 60 seconds',
    timeout: 0,
  })
}

const bree = new Bree({
  jobs,
})

const graceful = new Graceful({ brees: [bree] })
graceful.listen()
bree.start()