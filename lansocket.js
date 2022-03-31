import config from './config.js'

const args = process.argv.slice(2)
const [command] = args

const commands = {
  kbLayout: async function() {
    const result = await fetch(`http://localhost:3098/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        action: 'keyPress',
        data: 'layout',
      })
    })
  },
}


if(command) {
  await commands[command]()
}

process.exit(0)