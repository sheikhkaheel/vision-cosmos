import dotenv from "dotenv";
dotenv.config({ debug: false });

type Location = {
  latitude: number;
  longitude: number;
};

const knownPlanets = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "sun",
  "moon",
];

export async function getRaAndDec(
  planet: string,
  location: Location
): Promise<{ ra: number; dec: number }> {
  try {
    const appId = process.env.APP_ID!;
    const appSecret = process.env.APP_SECRET!;
    let ra: number | null = null;
    let dec: number | null = null;

    if (!appId || !appSecret) {
      return { ra: 0, dec: 0 };
    }

    if (!planet || !location) {
      return { ra: 0, dec: 0 };
    }

    const today = new Date().toISOString().split("T")[0];
    const planetKey = planet.trim().toLowerCase();

    const authHeader = {
      Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString(
        "base64"
      )}`,
    };

    let response, data;

    if (knownPlanets.includes(planetKey)) {
      // Use /bodies/positions endpoint
      const url = `https://api.astronomyapi.com/api/v2/bodies/positions/${planetKey}?latitude=${location.latitude}&longitude=${location.longitude}&elevation=10&from_date=${today}&to_date=${today}&time=12:00:00`;

      response = await fetch(url, { headers: authHeader });
      data = await response.json();

      const pos =
        data?.data?.table?.rows?.[0]?.cells?.[0]?.position?.equatorial;
      ra = parseFloat(pos?.rightAscension?.hours);
      dec = parseFloat(pos?.declination?.degrees);
    } else {
      // Fuzzy search for unknown body
      const url = `https://api.astronomyapi.com/api/v2/search?term=${encodeURIComponent(
        planetKey
      )}&match_type=fuzzy`;
      response = await fetch(url, { headers: authHeader });
      data = await response.json();

      const match = data?.data?.[0];
      ra = parseFloat(match?.position?.equatorial?.rightAscension?.hours);
      dec = parseFloat(match?.position?.equatorial?.declination?.degrees);
    }

    if (
      typeof ra !== "number" ||
      isNaN(ra) ||
      typeof dec !== "number" ||
      isNaN(dec)
    ) {
      return { ra: 0, dec: 0 };
    }

    return { ra, dec };
  } catch (err) {
    console.error("Error in getRaAndDec:", err);
    return { ra: 0, dec: 0 };
  }
}

export async function move_to_ra_and_dec(
  ra: number,
  dec: number
): Promise<{ success: boolean; message: string }> {
  const coordinates = { ra, dec };

  const result = await fetch(`http://localhost:4000/gotoRaDec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coordinates),
  });
  const flaskJson = await result.json();

  if (flaskJson.success) {
    return { success: true, message: "Telescope moved successfully" };
  } else {
    return { success: false, message: "Failed to move telescope" };
  }
}

export async function move_precise_to_ra_and_dec(
  ra: number,
  dec: number
): Promise<{ success: boolean; message: string }> {
  const coordinates = { ra, dec };
  const result = await fetch(`http://localhost:4000/gotoRaDecPrecise`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coordinates),
  });
  const flaskJson = await result.json();

  if (flaskJson.success) {
    return { success: true, message: "Telescope moved successfully" };
  } else {
    return { success: false, message: "Failed to move telescope" };
  }
}

export async function get_ra_and_dec(): Promise<{
  success: boolean;
  ra: number;
  dec: number;
}> {
  const result = await fetch(`http://localhost:4000/getRaDec`);
  const flaskJson = await result.json();

  if (flaskJson) {
    return { success: true, ra: flaskJson.ra, dec: flaskJson.dec };
  } else {
    return { success: false, ra: 0, dec: 0 };
  }
}

export async function get_precise_ra_and_dec(): Promise<{
  success: boolean;
  ra: number;
  dec: number;
}> {
  const result = await fetch(`http://localhost:4000/getRaDecPrecise`);
  const flaskJson = await result.json();

  if (flaskJson) {
    return { success: true, ra: flaskJson.ra, dec: flaskJson.dec };
  } else {
    return { success: false, ra: 0, dec: 0 };
  }
}
