import { execSync } from 'child_process'
import {
  SocketServer,
  SocketClient,
} from '@ssk101/facade-sockets'
import {
  createServer
} from '@ssk101/facade-server'
import { Logger } from './services/logger.mjs'
import config from './config.js'

const logger = new Logger({ prefix: '[server]' })

const {
  localHostName,
  wsPort,
  port,
  hosts,
  __dirname,
} = config

logger.info({ localHostName })

const socketClient = new SocketClient({
  port: wsPort,
  host: localHostName,
  namespace: localHostName,
  connectCallback: (e) => {
    logger.info(localHostName, 'connected to server', e)
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
        logger.info('Received client message', req.body)
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
        logger.info(host, 'connected')
      },
      closeCallback: (e) => {
        logger.info(host, 'closed')
      },
      disconnectCallback: (e) => {
        logger.info(host, 'disconnected')
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
    logger.error(e)
  }
}

initSocketServer()