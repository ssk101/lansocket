module.exports = {
  apps: [
    {
      name: 'lansocket-server',
      script: './index.js',
      watch: true,
      max_memory_restart: '2G',
      autorestart: true,
      restart_delay: 30000,
      node_args: [
        '--experimental-json-modules',
      ],
    },
    {
      name: 'lansocket-jobs',
      script: './jobs/index.mjs',
      watch: true,
      max_memory_restart: '1G',
      autorestart: true,
      restart_delay: 30000,
      node_args: [
        '--experimental-json-modules',
      ],
    },
  ]
}