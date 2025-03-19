# Bible Monorepo

A monorepo containing a client-server application structure:

- **Client**: React application with React Router v7, built with Vite
- **Server**: Mastra AI agent framework for building AI applications

## Features

- Modern React frontend with React Router v7
- AI-powered weather information using Mastra AI agents
- Clean separation of client and server code
- Complete TypeScript support

## Prerequisites

- [Bun](https://bun.sh/) (>= 1.0.0)
- OpenAI API key (for the Mastra server)

## Setup

```bash
# Install dependencies in all workspaces
bun install

# Configure the OpenAI API key
# Edit the server/.env file and add your key
```

### OpenAI API Key

You need to provide your OpenAI API key in the `server/.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Development

```bash
# Run both client and server in development mode
bun run dev

# Run only client
bun run dev:client

# Run only server
bun run dev:server
```

## Build

```bash
# Build both client and server
bun run build

# Build only client
bun run build:client

# Build only server
bun run build:server
```

## Preview

```bash
# Preview both client and server
bun run preview

# Preview only client
bun run preview:client

# Preview only server
bun run preview:server
```

## Project Structure

```
bible-monorepo/
├── client/               # Frontend React application
│   ├── public/           # Public assets
│   └── src/              # Source code
│       ├── routes/       # React Router route components
│       ├── App.tsx       # Main App component
│       └── main.tsx      # Entry point
│
├── server/               # Backend Mastra server
│   └── src/              # Source code
│       ├── mastra/       # Mastra configuration
│       │   ├── agents/   # Agent definitions
│       │   ├── tools/    # Tool definitions
│       │   └── index.ts  # Mastra entry point
│       └── index.ts      # Server entry point
│
└── package.json          # Root package.json for monorepo management
```

## Technologies

### Client

- React 19
- React Router 7
- TypeScript
- Vite 6

### Server

- Mastra AI framework
- TypeScript
- OpenAI integration

## License

MIT
# Bible
