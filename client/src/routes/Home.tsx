import React, { useState } from "react";

export function HomePage() {
  const [weatherQuery, setWeatherQuery] = useState("");
  const [weatherResponse, setWeatherResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWeatherRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weatherQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4111/api/agents/weatherAgent/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [weatherQuery],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get weather information");
      }

      const data = await response.json();
      setWeatherResponse(data.text);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherResponse(
        "Error fetching weather information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-2">
        Weather Information
      </h2>
      <p className="mb-6">Ask about the weather in any location</p>

      <form onSubmit={handleWeatherRequest} className="flex gap-2 mb-6">
        <input
          type="text"
          value={weatherQuery}
          onChange={(e) => setWeatherQuery(e.target.value)}
          placeholder="What's the weather in London?"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded-md text-base hover:bg-primary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {weatherResponse && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-medium text-primary mb-2">Response:</h3>
          <p>{weatherResponse}</p>
        </div>
      )}
    </div>
  );
}
