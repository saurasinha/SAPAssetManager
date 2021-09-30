#! /bin/bash
echo "Debugging test: $1"
node --inspect-brk=127.0.0.1:9339 ./node_modules/mocha/bin/_mocha --no-timeouts -r tslib $1
