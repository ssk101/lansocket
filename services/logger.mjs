import chalk from 'chalk'

const defaults = {
  'log': { fg: '#FFFFFF', bg: '#303030' },
  'info': { fg: '#FFFFFF', bg: '#00547a' },
  'warn': { fg: '#fcef3b', bg: '#a83b00' },
  'error': { fg: '#FFFFFF', bg: '#59030d' },
}

export class Logger {
  constructor(options) {
    this.options = Object.assign({}, defaults, options)

    for(const method in Object.getOwnPropertyDescriptors(console)) {
      if(typeof console[method] !== 'function') continue

      this[method] = function() {
        const args = Array.from(arguments).map(arg => {
          if(typeof arg === 'object') {
            return JSON.stringify(arg, null, 2)
          }

          return arg
        })

        if(typeof this.options.prefix === 'string') {
          args.unshift(this.options.prefix)
        }

        try {
          const  { fg, bg, mod } = this.options[method]
          const modFn = mod && chalk[mod]
          let chalked = chalk.hex(fg).bgHex(bg)

          if(modFn) chalked = modFn(chalked)

          console[method].apply(console, [chalked(...Array.from(args))])
        } catch (e) {
          console[method].apply(console, args)
        }
      }
    }
  }
}

export default new Logger()