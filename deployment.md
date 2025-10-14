# Deployment Guide for Superfan Verified

This document provides a detailed guide on how to deploy both the frontend and the backend of the Superfan Verified application.

## Prerequisites

*   An AWS account with the AWS CLI installed and configured.
*   A GitHub, GitLab, or Bitbucket account with your project's code.
*   Node.js and npm installed on your local machine.
*   The Serverless Framework installed globally (`npm install -g serverless`).
*   An Expo account and the EAS CLI installed globally (`npm install -g eas-cli`).

---

## Part 1: Backend Deployment (AWS Lambda + API Gateway)

The backend is a serverless application that is deployed to AWS Lambda and API Gateway using the Serverless Framework.

### Step 1: Configure Backend Environment Variables

Before you deploy, you need to set up the environment variables for the backend. The backend uses a `.env` file for this. You can copy the `.env.example` file to `.env` and fill in the values.

**Important:** The `serverless.yml` file we created will automatically create the DynamoDB tables for you. You just need to provide the AWS credentials with the necessary permissions.

### Step 2: Deploy the Backend

1.  Navigate to the `superfan-backend` directory:
    ```bash
    cd superfan-backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Deploy the service to AWS:
    ```bash
    npm run deploy
    ```
    The Serverless Framework will now package your application, create the necessary AWS resources (including the DynamoDB tables), and deploy the code.

4.  **Get the API URL:** After the deployment is complete, the Serverless Framework will output the URL of your deployed API. It will look something like this:
    `https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/`

    You will need this URL for the frontend configuration.

---

## Part 2: Frontend Deployment (EAS Build)

The frontend is a React Native application built with Expo. We will use EAS (Expo Application Services) to build the application.

### Step 1: Configure Frontend Environment Variables

The frontend needs to know the URL of the deployed backend. You will need to create a secret in your EAS project for this.

1.  Log in to your Expo account in your terminal:
    ```bash
    eas login
    ```
2.  Create a secret for the API URL:
    ```bash
    eas secret:create --name API_URL --value <your-backend-api-url>
    ```
    Replace `<your-backend-api-url>` with the URL you got from the backend deployment.

You will also need to create secrets for the other environment variables in `app.config.ts`, such as the Spotify and Twitter API keys.

### Step 2: Build the Application

1.  Navigate to the `superfan-frontend` directory:
    ```bash
    cd ../superfan-frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the build process:
    ```bash
    eas build --platform all
    ```
    This command will start a build for both Android and iOS. You can also specify a single platform (`--platform android` or `--platform ios`).

4.  EAS will guide you through the rest of the process. It will ask you to create a project if you haven't already, and it will handle the signing of your application.

### Step 3: Submit to App Stores

Once the build is complete, you can download the `apk` (for Android) or `ipa` (for iOS) file from your Expo account and submit it to the Google Play Store or the Apple App Store.

For the hackathon, you can also just provide a link to the build on the EAS website, which will allow the judges to download and install the app on their devices.

---

## Conclusion

By following this guide, you have deployed both the backend and the frontend of the Superfan Verified application. Your application is now live and ready to be used.
