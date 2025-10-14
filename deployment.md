# Deployment Guide for Superfan Verified

This document provides a detailed guide on how to deploy both the frontend and the backend of the Superfan Verified application.

## Prerequisites

*   An AWS account with the AWS CLI installed and configured with a user that has administrator permissions (for the initial deployment).
*   A GitHub, GitLab, or Bitbucket account with your project's code.
*   Node.js and npm installed on your local machine.
*   The Serverless Framework installed globally (`npm install -g serverless`).
*   An Expo account and the EAS CLI installed globally (`npm install -g eas-cli`).

---

## Part 1: Backend Deployment (AWS Lambda + API Gateway)

The backend is a serverless application defined with the Serverless Framework (`serverless.yml`) and deployed to AWS Lambda and API Gateway.

### Step 1: Configure Backend Environment Variables

Before you deploy, you need to set up the environment variables for the backend. The backend uses a `.env` file for this.

1.  In the `superfan-backend` directory, copy the `.env.example` file to a new file named `.env`.
2.  Fill in the values for the following variables in the `.env` file:
    *   `JWT_SECRET`: A secret key for signing JSON Web Tokens.
    *   `REFRESH_TOKEN_EXPIRES_DAYS`: The number of days a refresh token is valid.
    *   `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`: Your Spotify API credentials.
    *   (Add any other secrets for the OAuth providers you are using).

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
    The Serverless Framework will now read your `serverless.yml` file, package your application, create the necessary AWS resources (including the four DynamoDB tables), and deploy the code.

4.  **Get the API URL:** After the deployment is complete, the Serverless Framework will output the URL of your deployed API. It will look something like this:
    `https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/`

    You will need this URL for the frontend configuration.

---

## Part 2: Frontend Deployment (EAS Build)

The frontend is a React Native application built with Expo. We will use EAS (Expo Application Services) to build the application.

### Step 1: Configure Frontend Environment Variables

The frontend needs to know the URL of the deployed backend and other secrets. You will need to create secrets in your EAS project for these.

1.  Log in to your Expo account in your terminal:
    ```bash
    eas login
    ```
2.  Create secrets for your project. You can do this one by one:
    ```bash
    eas secret:create --name API_URL --value <your-backend-api-url>
    eas secret:create --name EXPO_PUBLIC_SPOTIFY_CLIENT_ID --value <your-spotify-client-id>
    # ... and so on for all the secrets in your app.config.ts
    ```
    Alternatively, you can use the `create-expo-secrets.sh` script as a template.

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
    This command will start a build for both Android and iOS.

4.  EAS will guide you through the rest of the process, including creating a project and handling app signing.

### Step 3: Submit to App Stores

Once the build is complete, you can download the application from the EAS website and submit it to the app stores. For the hackathon, providing a link to the EAS build is sufficient.

---

## Conclusion

By following this guide, you have deployed both the backend and the frontend of the Superfan Verified application. Your application is now live and ready to be used.