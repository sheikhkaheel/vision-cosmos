"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import VoiceToText from "./voice-input";
import { useGeolocation } from "./get-location";

interface AddPlanetProps {
  location: { latitude: number; longitude: number } | null;
  getLocation: () => void;
  error?: string;
}

export default function AddPlanet({
  location,
  getLocation,
  error,
}: AddPlanetProps) {
  const [planet, setPlanet] = useState<string>("mars");
  const [coordinatesString, setCoordinatesString] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [telescopeResponse, setTelescopeResponse] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const getCoordinates = async (e: FormEvent) => {
    e.preventDefault();

    if (!location) {
      setErrorMessage(
        "Allow Location to Get Coordinates of The Celestial Body"
      );
      return getLocation();
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/planet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planet, location }),
      });

      const { ra, dec, telescopeResponse, error } = await response.json();

      if (error) {
        setErrorMessage(error);
        setTelescopeResponse("");
      }

      if (!response.ok || response.status === 400) {
        setCoordinatesString("Error fetching coordinates");
        return setIsLoading(false);
      }

      setCoordinatesString(`RA: ${ra} hours, Dec: ${dec} degrees`);
      setTelescopeResponse(telescopeResponse);
      setIsLoading(false);
      setErrorMessage("");
    } catch (err: unknown) {
      if (err instanceof Error) console.log(err.message);
      console.error("Error fetching coordinates:", err);
    }
  };

  const handlePlanetName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.trim();
    setPlanet(name);
    setCoordinatesString(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br px-4 py-10 flex flex-col mt-20 items-center text-white">
      <div className="max-w-md mx-auto mt-6 p-6 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
        <label
          htmlFor="planet-input"
          className="block text-sm text-center font-medium text-white mb-2"
        >
          🔭 Enter Celestial Body
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            id="planet-input"
            onChange={handlePlanetName}
            placeholder="e.g., Mars, Jupiter, Vega..."
            className="flex-grow px-4 py-2 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={getCoordinates}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 text-blue-400 font-semibold text-lg flex items-center gap-2">
          <div className="animate-spin">🚀</div>
          Loading...
        </div>
      )}

      {coordinatesString && !error && !isLoading && (
        <div className="mt-6 bg-gray-700 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold animate-bounce">
            {planet.toUpperCase()}
          </div>
          <div className="text-green-400 mt-2">{coordinatesString}</div>
          <div className="text-md text-gray-400 mt-2">{telescopeResponse}</div>
        </div>
      )}

      {(error || errorMessage) && (
        <div className="mt-6 border border-red-400 bg-red-900 font-bold rounded-xl p-4 text-center">
          {errorMessage || error}
        </div>
      )}

      {location && (
        <div className="mt-6 bg-gray-700 p-4 rounded-xl text-center">
          🌐 Latitude:{" "}
          <span className="text-green-400">{location.latitude}</span>
          {" | "}
          Longitude:{" "}
          <span className="text-green-400">{location.longitude}</span>
        </div>
      )}
    </div>
  );
}
