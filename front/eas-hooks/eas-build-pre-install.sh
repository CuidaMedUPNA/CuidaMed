#!/bin/bash

echo "📦 Building @cuidamed-api/client..."

# Navigate to the api/client directory from the monorepo root
cd ../api/client

# Install dependencies for the client package
npm install

# Build the client
npm run build

echo "✅ @cuidamed-api/client built successfully!"
