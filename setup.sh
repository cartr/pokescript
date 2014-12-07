#!/usr/bin/bash
sudo apt-get -y install make gcc bison git python python-setuptools python-pip python-dev
cd rom-build/rgbds
sudo make install
cd ../../pokered
sudo pip install -r extras/requirements.txt
make red
cd ../rom-build
python build-base64-rom.py