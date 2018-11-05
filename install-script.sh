#!/bin/bash
set -e

echo "deb http://ftp.uk.debian.org/debian jessie-backports main" | tee -a /etc/apt/sources.list
apt-get update -y && apt-get install -y ffmpeg imagemagick