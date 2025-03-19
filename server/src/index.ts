import { mastra } from "./mastra";

// Mastra will handle the API routing based on the configuration
// in the `mastra.config.ts` file by default when running `mastra dev`

// This file is used for direct testing/development
async function main() {
  // Get the Bible agent
  const agent = await mastra.getAgent("bibleAgent");

  // Test the Bible agent with a sample query
  const result = await agent.generate("What does the Bible say about love?");

  console.log("Agent response:", result.text);
}

// Only run this function if directly executing this file
if (require.main === module) {
  main();
}
