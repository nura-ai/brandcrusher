#!/bin/bash

echo "🚀 Deploying Brand Crusher to Netlify..."

# Build the project
cd packages/nextjs
npm install
npm run build

echo "✅ Build completed!"
echo "📁 Build files are in packages/nextjs/.next"
echo "🌐 Ready for Netlify deployment!"
