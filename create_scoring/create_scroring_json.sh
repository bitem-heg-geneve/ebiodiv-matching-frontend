#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR

cp ../src/services/scoring.js ./scoring.mjs
cp ../src/store/index.js ./store.mjs
node --experimental-modules index.mjs "$1"
rm ./scoring.mjs
rm ./store.mjs
