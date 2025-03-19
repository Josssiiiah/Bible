import React from "react";

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">About This App</h2>
      <p className="mb-6">
        This is a Bible application built with a modern tech stack:
      </p>

      <h3 className="text-xl font-medium text-secondary mt-6 mb-2">Client</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>React with TypeScript</li>
        <li>React Router v7</li>
        <li>Vite build tool</li>
      </ul>

      <h3 className="text-xl font-medium text-secondary mt-6 mb-2">Server</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Mastra AI framework</li>
        <li>OpenAI integration</li>
        <li>REST API endpoints</li>
      </ul>

      <p className="my-6">
        The app demonstrates how to build a monorepo with a client-server
        architecture, all powered by Bun.
      </p>

      <h3 className="text-xl font-medium text-secondary mt-6 mb-2">Features</h3>
      <p>
        Currently, the app includes a weather information feature using the
        Mastra AI agent. You can ask about the weather in any location, and the
        agent will provide you with relevant information.
      </p>
    </div>
  );
}
