"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Trash2, Keyboard } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Props {
  location: { latitude: number; longitude: number } | null;
  getLocation: () => void;
  error: string | null;
}

const TelescopeController: React.FC<Props> = ({
  location,
  getLocation,
  error,
}) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        setApiError("Speech recognition error: " + event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const moveTelescope = async () => {
    if (!location) {
      setApiError("Location required! Please allow location access.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    console.log("Input =>", text, location);

    try {
      const res = await fetch("/api/celesial-body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planet: text, location }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.error) {
        setApiError(data.error);
      }
    } catch (err: any) {
      setApiError("API Error: " + (err.message || "Something went wrong"));
      setIsLoading(false);
    }
  };

  const clearText = () => setText("");
  const toggleInputMode = () => setIsTextMode((prev) => !prev);

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-zinc-900/80 backdrop-blur-lg border border-white/10 text-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent animate-gradient-x">
        🎙️ Voice / Keyboard Mode
      </h2>

      <div className="flex flex-col items-center gap-4 mb-6">
        {isTextMode ? (
          <div className="w-full">
            <label className="block mb-2 text-lg font-semibold text-white/80">
              Enter Celestial Body
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Saturn"
              className="w-full px-4 py-3 text-lg rounded-xl bg-zinc-800 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={toggleRecording}
              className={`w-28 h-28 rounded-full text-white flex items-center justify-center text-4xl transition-transform duration-300 shadow-xl hover:scale-110 ${
                isRecording
                  ? "bg-red-600 animate-pulse"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {!isRecording ? <MicOff size={36} /> : <Mic size={36} />}
            </button>
            <span className="text-lg font-medium text-white/70">
              {text ? `"${text}"` : "Speak now..."}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={moveTelescope}
          disabled={!text || isLoading}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            !text || isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <Send size={20} />
          {isLoading ? "Sending..." : "Move Telescope"}
        </button>

        <button
          onClick={clearText}
          className="px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white flex items-center justify-center"
        >
          <Trash2 size={20} />
        </button>

        <button
          onClick={toggleInputMode}
          className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white flex items-center justify-center"
        >
          {isTextMode ? <Mic size={20} /> : <Keyboard size={20} />}
        </button>
      </div>

      <div className="mt-6 space-y-2 text-center text-sm">
        {!location ? (
          <div className="text-red-400">
            Location not available.
            <button
              onClick={getLocation}
              className="underline text-blue-400 hover:text-blue-300 transition"
            >
              Request permission
            </button>
          </div>
        ) : (
          <div className="text-green-400">
            🌐 Lat: {location.latitude.toFixed(3)}, Lon:{" "}
            {location.longitude.toFixed(3)}
          </div>
        )}

        {(error || apiError) && !location && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-2 rounded-xl">
            ⚠️ {error || apiError}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelescopeController;
