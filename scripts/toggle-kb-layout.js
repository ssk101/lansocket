#!/usr/bin/env zx

const current = await $`gsettings get org.gnome.desktop.input-sources sources`
console.log({ current })