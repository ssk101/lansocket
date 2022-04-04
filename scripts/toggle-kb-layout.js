#!/usr/bin/env zx

// Can create an array of all the keyboard layouts if needed like below.

// const layouts = await $`gsettings get org.gnome.desktop.input-sources sources`
// const currentLangs = layouts
//   .toString()
//   .match(/(?<=\('xkb', ')(\w*)/g)


const currentIndex = +(await $`gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Eval "imports.ui.status.keyboard.getInputSourceManager().currentSource.index"`)
  .toString()
  .replace(/[(')]/g, '')
  .split(',')
  .pop()
  .trim()

await $`gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/Shell \
  --method org.gnome.Shell.Eval \
  "imports.ui.status.keyboard.getInputSourceManager().inputSources[${Number(!Boolean(currentIndex))}].activate()"`
