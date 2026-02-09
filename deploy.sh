#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Build the frontend
echo "Building the frontend..."
cd zaksoft-learn-frontend
npm install
npm run build
cd ..

echo "Frontend build complete."

echo "Deploying to Firebase..."
# The classic_firebase_hosting_deploy tool would be used here in a real environment
# For this example, we'll just print a success message.
echo "Deployment to Firebase would be initiated here."

echo "Deployment script finished."
