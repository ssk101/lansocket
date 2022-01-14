#!/bin/bash

new=""
current=$(setxkbmap -query | awk '/layout/ {print $2}')

if [[ $current == "us" ]] ; then
  new="no"
else
  new="us"
fi

setxkbmap -model pc104 -layout $new
