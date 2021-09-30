#! /bin/bash
lastTest=$(cat bin/lastTestedFile.txt)
scriptDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$scriptDir/run_test.sh $lastTest
