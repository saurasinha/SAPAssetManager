#! /bin/bash
echo Running test: $1
./node_modules/mocha/bin/_mocha -r tslib $1
