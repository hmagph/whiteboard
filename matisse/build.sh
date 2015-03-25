#! /bin/bash
sudo ln -s /usr/bin/make /usr/bin/gmake
#not 100% sure we need express generator - I needed it
#when doing an express tutorial (the app is using an express framework)
sudo npm install -g express
sudo npm install -g express-generator

sudo apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install \
        redis-server
SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$SCRIPTDIR"
sudo npm install -d
