import {
  SocketServer, SocketClient,
} from '@ssk101/facade-sockets'
// import { routes } from './routes.js'

const server = new SocketServer({ port: 3099 })
const client = new SocketClient({ port: 3099 })
