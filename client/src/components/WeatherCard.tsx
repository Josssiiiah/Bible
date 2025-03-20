import React from "react";

// Updated to match the actual response format from the weather tool
interface WeatherCardProps {
  weatherData: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windGust: number;
    conditions: string;
    location: string;
  };
}

export function WeatherCard({ weatherData }: WeatherCardProps) {
  // Ensure we have appropriate formatting for displaying the data
  const formatTemp = (temp: number) => `${Math.round(temp * 10) / 10}°C`;
  const formatWind = (speed: number) => `${Math.round(speed)} km/h`;

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm max-w-md w-full">
      <div className="bg-blue-500 text-white px-4 py-2">
        <h3 className="text-lg font-semibold">
          Weather in {weatherData.location}
        </h3>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold">
            {formatTemp(weatherData.temperature)}
          </div>
          <div className="text-lg text-gray-700">{weatherData.conditions}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Feels like:</span>
            <span>{formatTemp(weatherData.feelsLike)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Humidity:</span>
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Wind:</span>
            <span>{formatWind(weatherData.windSpeed)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Gusts:</span>
            <span>{formatWind(weatherData.windGust)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
