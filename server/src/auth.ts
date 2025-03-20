import { OAuth2Client } from "google-auth-library";
import { AuthServer } from "./mastra/utils/auth-server";

// This script provides a convenient way to authenticate with Google Calendar
// without needing to go through the API
async function main() {
  console.log("Starting Google Calendar authentication flow...");

  // Create a placeholder OAuth client that will be replaced with proper credentials
  const oauth2Client = new OAuth2Client();

  // Create and start the auth server
  const authServer = new AuthServer(oauth2Client);
  const success = await authServer.start();

  if (success) {
    console.log("Authentication successful!");
    console.log(
      "You can now use the Google Calendar tools with the Bible agent."
    );
  } else {
    console.error(
      "Authentication failed. Please check your credentials and try again."
    );
  }

  // The server will be stopped automatically after authentication
}

// Run the authentication flow
main().catch((error) => {
  console.error("Error in authentication:", error);
  process.exit(1);
});
