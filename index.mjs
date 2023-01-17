import { execSync } from 'child_process'
import {
  SocketServer,
  SocketClient,
} from '@ssk101/facade-sockets'
import {
  createServer
} from '@ssk101/facade-server'
import config from './config.js'

const {
  localHostName,
  wsPort,
  port,
  hosts,
  __dirname,
} = config

const socketClient = new SocketClient({
  port: wsPort,
  host: localHostName,
  namespace: localHostName,
  connectCallback: (e) => {
    console.log(localHostName, 'connected to server')
  }
})

const socketServer = new SocketServer({ port: wsPort })
await socketServer.createServer()

const httpServer = await createServer({
  namespace: localHostName,
  client: false,
  useRedis: false,
  port,
  routes: {
    '/send-message': {
      method: 'post',
      handlers: [(req, res, next) => {
        console.log('client', req.body)
        socketClient.socket.emit(req.body)
        return req.body
      }],
    },
  }
})

async function initSocketServer() {
  const nsps = {}

  for(const host of hosts) {

    if(host === localHostName) continue

    nsps[host] = await socketServer.namespace(`/${host}`, {
      connectCallback: (e) => {
        console.log(host, 'connected')
      },
      closeCallback: (e) => {
        console.log(host, 'closed')
      },
      disconnectCallback: (e) => {
        console.log(host, 'disconnected')
      },
      eventCallback: async (e, message) => {
        await xs(message)
      }
    })
  }
}

async function xs({ context, action, data }) {
  try {
    execSync(`${__dirname}/scripts/${context}/${action}.mjs`, {
      stdio: 'inherit',
      cwd: `${__dirname}/scripts`,
    })
  } catch (e) {
    console.error(e)
  }
}

initSocketServer()