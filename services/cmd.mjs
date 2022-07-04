export async function cmd(command, args = [], opts = {}) {
  const fullCmd = [command].concat(args)

  const { stdout } = await $`${fullCmd}`

  if(opts.verbose) {
    console.log({ stdout })
  }

  return stdout
}