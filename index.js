import {
  SocketServer, SocketClient,
} from '@ssk101/facade-sockets'
import { port, host, client } from './config.js'

const server = new SocketServer({ port })
await server.createServer()
const client = new SocketClient({ port, host: client })

client.socket.emit('hello')
server.io.on('*', (msg) => {
  console.log({ msg })
})