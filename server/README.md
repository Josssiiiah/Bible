# Bible Assistant Server with Google Calendar Integration

This server provides the backend for the Bible Assistant application, powered by Mastra AI and integrated with Google Calendar API for scheduling events.

## Features

- Bible knowledge assistant with AI-powered responses
- Weather information tool
- Google Calendar integration for scheduling events and meetings

## Setup

### Prerequisites

1. Node.js 18+ or Bun 1.0+
2. OpenAI API key
3. Google Cloud Platform account with Calendar API enabled
4. OAuth consent screen configured in Google Cloud Console

### Installation

```bash
# Using npm
npm install

# Or using Bun
bun install
```

### Setting Up Google Calendar API

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Calendar API
3. Configure the OAuth consent screen
   - Set the application type to "Desktop app"
   - Add the necessary scopes (`https://www.googleapis.com/auth/calendar`)
4. Create OAuth credentials
   - Download the credentials JSON file
   - Rename it to `gcp-oauth.keys.json` and place it in the root of the server directory

Example `gcp-oauth.keys.json` structure:

```json
{
  "installed": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "project_id": "YOUR_PROJECT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": [
      "http://localhost:3000/oauth2callback",
      "http://localhost"
    ]
  }
}
```

### OpenAI API Key

Create a `.env` file in the server directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Google Calendar Authentication

Before using the Google Calendar features, you need to authenticate the application:

```bash
# Run the authentication script
npm run auth

# Or with Bun
bun run auth
```

This will:

1. Open a browser window to authorize the application
2. Ask you to log in to your Google account
3. Request permission to access your calendar
4. Save the authentication tokens for future use

## Development

```bash
# Start the development server
npm run dev

# Or with Bun
bun run dev
```

## Usage

Once the server is running and you've authenticated with Google Calendar, you can use the Bible Assistant to:

1. Ask questions about the Bible
2. Check the weather in different locations
3. Manage your Google Calendar:
   - List your calendars
   - View upcoming events
   - Create new events
   - Update existing events
   - Delete events

Example prompts:

- "What does the Bible say about love?"
- "What's the weather like in New York?"
- "Show me my calendar events for this week"
- "Create a Bible study event for tomorrow at 7 PM"
- "Schedule a prayer meeting on Friday from 6 PM to 7 PM"

## Security Notes

- OAuth tokens are stored in a `.gcp-saved-tokens.json` file - keep this file secure
- The application requires calendar permission only when you're actively using the calendar features
- Your calendar data is only accessed through your direct requests to the assistant

## Troubleshooting

If you experience any issues with calendar access:

1. Delete the `.gcp-saved-tokens.json` file
2. Run `npm run auth` or `bun run auth` again to re-authenticate

For other issues, check the server logs for more detailed error information.
