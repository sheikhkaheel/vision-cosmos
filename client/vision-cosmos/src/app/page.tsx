// app/page.tsx or app/home/page.tsx

"use client";

import { useState } from "react";
import AddPlanet from "./_component/add-planet";
import VoiceToTextRecorder from "./_component/voice-input";
import { useGeolocation } from "./_component/get-location";

export default function Home() {
  const [mode, setMode] = useState<"text" | "voice">("text");
  const { location, getLocation, error } = useGeolocation();

  const toggleMode = () => {
    setMode((prev) => (prev === "text" ? "voice" : "text"));
  };

  return (
    <div className="min-h-screen px-4 flex justify-center items-center py-10 bg-gradient-to-b from-black to-gray-900 text-white">
      <VoiceToTextRecorder
        location={location}
        getLocation={getLocation}
        error={error}
      />
    </div>
  );
}
