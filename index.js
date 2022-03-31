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

const { namespace, server, clients } = config
const isServer = server.namespace === namespace

if(!isServer) {
  const socketClient = new SocketClient({
    port: server.ws.port,
    host: server.ws.host,
    namespace,
    connectCallback: (e) => {
      console.log(namespace, 'connected to server')
    }
  })
} else {
  const httpServer = await createServer({
    namespace,
    client: false,
    useRedis: false,
    port: server.port,
    routes: {
      '/send-message': {
        method: 'post',
        handlers: [(req, res, next) => {
          socketClient.socket.emit(req.body)

          return req.body
        }],
      },
    }
  })

  const socketServer = new SocketServer({ port: server.ws.port })
  await socketServer.createServer()
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
      eventCallback: (e, message) => {
        const { action, data } = message
        if(action === 'keyPress') {
          if(data === 'layout') {
            try {
              execSync(`sh ${__dirname}/scripts/setkblayout.sh`, {
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

