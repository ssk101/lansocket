#!/usr/bin/env zx

const args = process.argv.slice(3)
const [command] = args

const commands = {
  kbLayout: async function() {
    await fetch('http://localhost:3098/send-message', {
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

await commands[command]()

process.exit(0)