#!/bin/bash

exit_status=0

# getting current version of the package
VER_NEW=$(node -e "console.log(require('./package.json').version);")

# getting version of published package
VER_OLD=$(npm view . version)

# the package has changed but the working version is the same as main version: failing test
if [ "$VER_NEW" = "$VER_OLD" ]
then
    echo "FAILED: Same version as published package"
    exit_status=1
# working version was bumped: test pass
else
    echo "PASSED: Version bump OK"
fi

exit ${exit_status}
