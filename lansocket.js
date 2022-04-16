import config from './config.js'

const args = process.argv.slice(2)
const [context, action] = args

async function send({ context, action, data = {} }) {
  return fetch(`http://localhost:3098/send-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      context,
      action,
      data,
    })
  }).then(res => res.json())
}

await send({ context, action })

process.exit(0)