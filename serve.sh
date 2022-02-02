#! /usr/bin/env bash

sudo docker run --rm -it -v ${PWD}:/src -p 1313:1313 klakegg/hugo:0.92.1 server
