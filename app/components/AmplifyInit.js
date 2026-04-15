"use client";

/**
 * Initializes AWS Amplify once on the client side.
 * Must be rendered before any component that calls Amplify Auth APIs.
 */

import { Amplify } from "aws-amplify";
import { amplifyConfig } from "../lib/amplifyConfig";

Amplify.configure(amplifyConfig, { ssr: true });

export default function AmplifyInit({ children }) {
  return children;
}
