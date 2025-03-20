import { mastra } from "./mastra";

async function testWeatherTool() {
  console.log("Testing weather tool...");

  try {
    // Get the Bible agent
    const agent = await mastra.getAgent("bibleAgent");

    // Test with a weather-related query
    const result = await agent.generate("What's the weather like in New York?");

    console.log("Agent text response:", result.text);

    // Log the full response with complete data
    console.log("Full response:", JSON.stringify(result, null, 2));

    // Access steps to see if tool usage is recorded there
    if (result.steps && result.steps.length > 0) {
      console.log("Steps:", JSON.stringify(result.steps, null, 2));
    }
  } catch (error) {
    console.error("Error testing weather tool:", error);
  }
}

testWeatherTool();
