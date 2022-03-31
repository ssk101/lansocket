#!/bin/bash

new=""
current=$(setxkbmap -query | awk '/layout/ {print $2}')

if [[ $current == "us,no" ]] ; then
  new="no,us"
else
  new="us,no"
fi

setxkbmap -model pc104 -layout $new
