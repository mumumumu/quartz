#!/bin/bash

export PATH=$PATH:/usr/local/bin
cd /app

CONTENT_DIR="/app/content"
TIMESTAMP_FILE="/app/.last_build_time"
BUILD_COMMAND="npx quartz build"

# Check if the content directory has been modified since the last run
if [ "$(find $CONTENT_DIR -type f -newer $TIMESTAMP_FILE)" ]; then
	echo "Changes detected. Rebuilding assets..."
	$BUILD_COMMAND
	# Update the timestamp file
	touch $TIMESTAMP_FILE
else
	echo "No changes detected."
fi
