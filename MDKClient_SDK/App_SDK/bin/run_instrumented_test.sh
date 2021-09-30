#! /bin/bash
echo Running instrumented test: $1
./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha -r tslib $1
