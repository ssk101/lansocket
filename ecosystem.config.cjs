module.exports = {
  apps: [
    {
      name: 'lansocket',
      script: './index.js',
      watch: true,
      max_memory_restart: '2G',
      autorestart: true,
      restart_delay: 30000,
      node_args: [
        '--experimental-json-modules',
      ],
    },
  ]
}