import { execSync } from 'child_process'
import {
  SocketServer,
  SocketClient,
} from '@ssk101/facade-sockets'
import {
  createServer
} from '@ssk101/facade-server'
import config from './config.js'

const { ws, server, clients, namespace } = config

const socketClient = new SocketClient({
  port: ws.port,
  host: ws.host,
  namespace,
  connectCallback: (e) => {
    console.log(namespace, 'connected to server')
  }
})

if(ws.namespace === namespace) {
  const socketServer = new SocketServer({ port: ws.port })
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
              execSync(`sh ${process.cwd()}/scripts/setkblayout.sh`, {
                stdio: 'inherit',
                cwd: `${process.cwd()}/scripts`,
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