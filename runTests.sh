#!/bin/bash

# Exit if any command returns error status
set -e

# Kill background node processes when script exits
trap 'kill $(jobs -p)' EXIT

# just running in a subshell with () would be nicer but seems to mess with trap
run () {
  pushd $1 > /dev/null
  $2 &
  popd > /dev/null
}

run examples/iron-router-example/ "meteor --port 3120"
run examples/flow-router-example/ "meteor --port 4160"

# Run automation tests
node_modules/.bin/nightwatch
