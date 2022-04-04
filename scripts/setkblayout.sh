#!/bin/bash

gsettings set org.gnome.desktop.input-sources sources "[('xkb', 'no'), ('xkb', 'us')]"

CURRENT=$(gsettings get org.gnome.desktop.input-sources sources)
NEW=

gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/Shell \
  --method org.gnome.Shell.Eval \
  "imports.ui.status.keyboard.getInputSourceManager().inputSources[1].activate()"


if [[ $CURRENT == "[('xkb', 'no'), ('xkb', 'us')]" ]] ; then
  new="[('xkb', 'us'), ('xkb', 'no')]"
else
  new="[('xkb', 'no'), ('xkb', 'us')]"
fi

setxkbmap -model pc104 -layout $new
