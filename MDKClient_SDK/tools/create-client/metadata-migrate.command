#!/bin/bash

cd "$(dirname "$0")"
node "metadata-migrate.js" "$@"
