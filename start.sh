#!/bin/bash

# Store the current working directory
CURRENT_DIR=$(pwd)

# Set these to your preferred environment and account to enable a shorter start syntax
# ./startup
DEFAULT_ACCT=""
DEFAULT_ENV=""

ENVIRONMENT="${DEFAULT_ENV:-"$1"}"
ACCOUNT="${DEFAULT_ACCT:-"$2"}"

echo ${ENVIRONMENT}
echo ${ACCOUNT}

# Check if environment and account were provided as arguments
if [[ -z "$ENVIRONMENT" ]]; then
  echo "Missing ENVIRONMENT"
  exit 1
fi
if [[ -z "$ACCOUNT" ]]; then
  echo "Missing ACCOUNT"
  exit 1
fi


# Define the path to the replacements JSON file
REPLACEMENTS_FILE="replacements.${ENVIRONMENT}.json"

# Create a temporary file for editing
TMP_FILE=$(mktemp)

# Check if the REPL_ACCOUNT line exists and remove it
if grep -q "REPL_ACCOUNT" "$REPLACEMENTS_FILE"; then
  echo "Removing REPL_ACCOUNT line from $REPLACEMENTS_FILE"
  grep -v "REPL_ACCOUNT" "$REPLACEMENTS_FILE" > "$TMP_FILE"
  mv "$TMP_FILE" "$REPLACEMENTS_FILE"
else
  echo "No REPL_ACCOUNT line found in $REPLACEMENTS_FILE"
fi

# Change the working directory to 'src'
cd src

# Run the bos-loader command from the 'src' directory
bos-loader -r "../$REPLACEMENTS_FILE" "$ACCOUNT"

# After bos-loader has finished, return to the previous working directory
cd "$CURRENT_DIR"
