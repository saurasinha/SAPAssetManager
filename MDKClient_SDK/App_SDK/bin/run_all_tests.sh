#! /bin/bash

if [ "$1" = "--help" ]; then
  echo "Run multiple tests one after the other individially."
  echo "Usage:"
  echo "  run_all_tests.sh <directory>"
  echo "  - If <directory> is not provided, all tests in the project are run individually."
  echo "  - If <directory> is provided, all tests under that directory are run individually."
  exit 0
fi

# By default, run all tests
rootDirs="app/tests plugins/tests ../../tools/application-bundler"

# But if they pass a directory, only run tests inside that directory
if [ -d "${1}" ] ; then
  rootDirs=$1
fi

tests=$(find $rootDirs -name '*.spec.js')
numTests=$(echo $tests | wc)
echo "Running $numTests JavaScript tests in runAllTests.sh."
for t in $tests; do
  echo $t > bin/lastTestedFile.txt
  echo Testing $t
  # If a test fails, exit with bad RC, so the checks do not pass
  ./node_modules/mocha/bin/_mocha -r tslib $t || exit 1
done

exit 0
