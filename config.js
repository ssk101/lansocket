const {
  LANSOCKET_NAMESPACE,
  LANSOCKET_SERVER_HOST,
  LANSOCKET_SERVER_PORT,
  LANSOCKET_WS_PORT,
} = process.env

export default {
  namespace: LANSOCKET_NAMESPACE,
  port: LANSOCKET_SERVER_PORT,
  wsPort: LANSOCKET_WS_PORT,
  server: {
    namespace: 'ubuntu-main',
    host: LANSOCKET_SERVER_HOST,
    port: LANSOCKET_SERVER_PORT,
    wsPort: LANSOCKET_WS_PORT,
  },
  clients: [{
    namespace: 'mbp',
  }],
}
