"use client";

import { useState, useCallback } from "react";

export interface Location {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>("");

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setError("");
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err: GeolocationPositionError) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return { location, error, getLocation };
}
