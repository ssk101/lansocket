const {
  LANSOCKET_NAMESPACE,
  LANSOCKET_SERVER_HOST,
  LANSOCKET_SERVER_PORT,
  LANSOCKET_WS_PORT,
} = process.env

export default {
  namespace: LANSOCKET_NAMESPACE,
  server: {
    namespace: 'ubuntu-main',
    host: LANSOCKET_SERVER_HOST,
    port: LANSOCKET_WS_PORT,
    ws: {
      host: LANSOCKET_SERVER_HOST,
      port: LANSOCKET_SERVER_PORT,
    },
  },
  clients: [{
    namespace: 'mbp',
  }],
}
