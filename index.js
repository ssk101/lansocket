import { execSync } from 'child_process'
import {
  SocketServer,
  SocketClient,
} from '@ssk101/facade-sockets'
import {
  createServer
} from '@ssk101/facade-server'
import config from './config.js'

const __dirname = ((await import('path')).dirname)
  (((await import('url')).fileURLToPath)(import.meta.url))

const { namespace, wsPort, port, server, clients } = config
const isServer = server.namespace === namespace

const socketClient = new SocketClient({
  port: wsPort,
  host: server.host,
  namespace,
  connectCallback: (e) => {
    console.log(namespace, 'connected to server')
  }
})

const socketServer = new SocketServer({ port: server.wsPort })
await socketServer.createServer()

const httpServer = await createServer({
  namespace,
  client: false,
  useRedis: false,
  port: port,
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

  for(const client of clients) {
    nsps[client.namespace] = await socketServer.namespace(`/${client.namespace}`, {
      connectCallback: (e) => {
        console.log(client.namespace, 'connected')
      },
      closeCallback: (e) => {
        console.log(client.namespace, 'closed')
      },
      disconnectCallback: (e) => {
        console.log(client.namespace, 'disconnected')
      },
      eventCallback: async (e, message) => {
        const { action, data } = message
        if(action === 'keyPress') {
          if(data === 'layout') {
            try {
              execSync(`${__dirname}/scripts/toggle-kb-layout.js`, {
                stdio: 'inherit',
                cwd: `${__dirname}/scripts`,
              })
            } catch (e) {
              console.error(e)
            }
          }
        }
      }
    })
  }
}

if(isServer) {
  initSocketServer()
}