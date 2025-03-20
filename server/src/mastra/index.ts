import { Mastra } from "@mastra/core";

import { weatherAgent } from "./agents/weather";
import { bibleAgent } from "./agents/bible";

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    bibleAgent,
  },
  // Add server middleware to enhance responses with toolCalls info
  serverMiddleware: [
    {
      handler: async (c, next) => {
        // Process the request normally
        await next();

        // Check if this is an agent generate response
        const path = c.req.path;
        if (path.includes("/api/agents/") && path.includes("/generate")) {
          try {
            // Get the response as JSON
            const response = c.res;
            const responseClone = response.clone();
            const responseData = await responseClone.json();

            // If the response has steps with toolResults but no toolCalls field at the root level,
            // extract the tool information from steps and add it to the root level
            if (
              responseData.steps &&
              responseData.steps.length > 0 &&
              responseData.steps[0].toolResults &&
              responseData.steps[0].toolResults.length > 0
            ) {
              // Directly expose the toolResults at the root level for easier access
              responseData.toolResults = responseData.steps[0].toolResults;

              // Create a new response with the modified data
              c.res = new Response(JSON.stringify(responseData), {
                headers: response.headers,
                status: response.status,
              });
            }
          } catch (error) {
            console.error("Error processing response middleware:", error);
            // Continue with original response if there's an error
          }
        }
      },
    },
  ],
});
