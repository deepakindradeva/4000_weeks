/**
 * AWS Amplify / Cognito configuration.
 *
 * Fill in the values from your AWS Cognito console:
 *   1. Cognito → User Pools → <your pool> → App integration tab
 *   2. Copy the User Pool ID, App Client ID, and the Cognito Domain
 *
 * For local dev the callback/sign-out URLs should include http://localhost:3000.
 * For production add your deployed domain to both lists in the Cognito console.
 *
 * Environment variables (recommended — never commit real values):
 *   NEXT_PUBLIC_COGNITO_USER_POOL_ID
 *   NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
 *   NEXT_PUBLIC_COGNITO_DOMAIN          (e.g. your-prefix.auth.us-east-1.amazoncognito.com)
 *   NEXT_PUBLIC_APP_URL                 (e.g. http://localhost:3000 or https://your-domain.com)
 */

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "us-east-1_XXXXXXXXX",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "XXXXXXXXXXXXXXXXXXXXXXXXXX",
      loginWith: {
        oauth: {
          domain:
            process.env.NEXT_PUBLIC_COGNITO_DOMAIN ||
            "your-prefix.auth.us-east-1.amazoncognito.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [
            process.env.NEXT_PUBLIC_APP_URL
              ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
              : "http://localhost:3000/auth/callback",
          ],
          redirectSignOut: [
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          ],
          responseType: "code",
        },
      },
    },
  },
};
