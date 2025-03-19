import { Mastra } from "@mastra/core";

import { weatherAgent } from "./agents/weather";
import { bibleAgent } from "./agents/bible";

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    bibleAgent,
  },
});
