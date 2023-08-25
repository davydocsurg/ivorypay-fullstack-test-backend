#!/bin/bash

# Run schema sync if the marker file doesn't exist
if [ ! -f /app/.initialized ]; then
  yarn build
  yarn typeorm schema:sync -- -d src/config/data-source.ts
  touch /app/.initialized
fi

# Start the main application process
yarn dev
