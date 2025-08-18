import dotenv from "dotenv";
import { api } from "./global.js";
dotenv.config({ debug: false });
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
// Get Ra/Dec from AstronomyApi
export async function getRaAndDec(planet, location) {
    try {
        const appId = process.env.APP_ID;
        const appSecret = process.env.APP_SECRET;
        let ra = null;
        let dec = null;
        if (!appId || !appSecret) {
            return { ra: 0, dec: 0 };
        }
        if (!planet || !location) {
            return { ra: 0, dec: 0 };
        }
        const today = new Date().toISOString().split("T")[0];
        const planetKey = planet.trim().toLowerCase();
        const authHeader = {
            Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`,
        };
        let response, data;
        if (knownPlanets.includes(planetKey)) {
            // Use /bodies/positions endpoint
            const url = `https://api.astronomyapi.com/api/v2/bodies/positions/${planetKey}?latitude=${location.latitude}&longitude=${location.longitude}&elevation=10&from_date=${today}&to_date=${today}&time=12:00:00`;
            data = await api(url, { headers: authHeader });
            // data = await response.json();
            const pos = data?.data?.table?.rows?.[0]?.cells?.[0]?.position?.equatorial;
            ra = parseFloat(pos?.rightAscension?.hours);
            dec = parseFloat(pos?.declination?.degrees);
        }
        else {
            // Fuzzy search for unknown body
            const url = `https://api.astronomyapi.com/api/v2/search?term=${encodeURIComponent(planetKey)}&match_type=fuzzy`;
            data = await api(url, { headers: authHeader });
            // data = await response.json();
            const match = data?.data?.[0];
            ra = parseFloat(match?.position?.equatorial?.rightAscension?.hours);
            dec = parseFloat(match?.position?.equatorial?.declination?.degrees);
        }
        if (typeof ra !== "number" ||
            isNaN(ra) ||
            typeof dec !== "number" ||
            isNaN(dec)) {
            return { ra: 0, dec: 0 };
        }
        return { ra, dec };
    }
    catch (err) {
        console.error("Error in getRaAndDec:", err);
        return { ra: 0, dec: 0 };
    }
}
// Goto Ra/Dec & Azm/Alt Functions
export async function move_to_ra_and_dec(ra, dec) {
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
    }
    else {
        return { success: false, message: "Failed to move telescope" };
    }
}
export async function move_precise_to_ra_and_dec(ra, dec) {
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
    }
    else {
        return { success: false, message: "Failed to move telescope" };
    }
}
export async function move_to_azm_and_alt(azm, alt) {
    const coordinates = { azm, alt };
    const result = await fetch(`http://localhost:4000/gotoAzmAlt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(coordinates),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope moved successfully" };
    }
    else {
        return { success: false, message: "Failed to move telescope" };
    }
}
export async function move_precise_to_azm_and_alt(azm, alt) {
    const coordinates = { azm, alt };
    const result = await fetch(`http://localhost:4000/gotoAzmAltPrecise`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(coordinates),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope moved successfully" };
    }
    else {
        return { success: false, message: "Failed to move telescope" };
    }
}
export async function cancel_goto_movement() {
    const result = await fetch(`http://localhost:4000/cancleGotoMovement`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope stopped successfully" };
    }
    else {
        return { success: false, message: "Failed to stop telescope" };
    }
}
// Get Ra/Dec & Azm/Alt Functions
export async function get_ra_and_dec() {
    const result = await fetch(`http://localhost:4000/getRaDec`);
    const flaskJson = await result.json();
    if (flaskJson) {
        return { success: true, ra: flaskJson.ra, dec: flaskJson.dec };
    }
    else {
        return { success: false, ra: 0, dec: 0 };
    }
}
export async function get_precise_ra_and_dec() {
    const result = await fetch(`http://localhost:4000/getRaDecPrecise`);
    const flaskJson = await result.json();
    if (flaskJson) {
        return { success: true, ra: flaskJson.ra, dec: flaskJson.dec };
    }
    else {
        return { success: false, ra: 0, dec: 0 };
    }
}
export async function get_azm_and_alt() {
    const result = await fetch(`http://localhost:4000/getAzmAlt`);
    const flaskJson = await result.json();
    if (flaskJson) {
        return { success: true, azm: flaskJson.azm, alt: flaskJson.alt };
    }
    else {
        return { success: false, azm: 0, alt: 0 };
    }
}
export async function get_precise_azm_and_alt() {
    const result = await fetch(`http://localhost:4000/getAzmAltPrecise`);
    const flaskJson = await result.json();
    if (flaskJson) {
        return { success: true, azm: flaskJson.azm, alt: flaskJson.alt };
    }
    else {
        return { success: false, azm: 0, alt: 0 };
    }
}
// Slew Functions
export async function slew_azm_variable(rate) {
    const result = await fetch(`http://localhost:4000/slewAzmVariable`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
export async function slew_alt_variable(rate) {
    const result = await fetch(`http://localhost:4000/slewAltVariable`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
export async function slew_variable(azm_rate, alt_rate) {
    const result = await fetch(`http://localhost:4000/slewVariable`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ azm_rate, alt_rate }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
export async function slew_azm_fixed(rate) {
    const result = await fetch(`http://localhost:4000/slewAzmFixed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
export async function slew_alt_fixed(rate) {
    const result = await fetch(`http://localhost:4000/slewAltFixed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
export async function slew_fixed(azm_rate, alt_rate) {
    const result = await fetch(`http://localhost:4000/slewFixed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ azm_rate, alt_rate }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
export async function slew_stop() {
    const result = await fetch(`http://localhost:4000/slewStop`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, message: "Telescope slewed successfully" };
    }
    else {
        return { success: false, message: "Failed to slew telescope" };
    }
}
// Location Functions
export async function get_location() {
    const result = await fetch(`http://localhost:4000/getLocation`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            latitude: flaskJson.latitude,
            longitude: flaskJson.longitude,
        };
    }
    else {
        return { success: false, latitude: 0, longitude: 0 };
    }
}
export async function set_location(latitude, longitude) {
    const result = await fetch(`http://localhost:4000/setLocation`, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            message: "Successfully set the location",
        };
    }
    else {
        return { success: false, message: "Failed to set the location" };
    }
}
// Time Functions
export async function get_time() {
    const result = await fetch(`http://localhost:4000/getTime`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            time: flaskJson.time,
        };
    }
    else {
        return { success: false, time: "" };
    }
}
export async function set_time(hour, min, sec) {
    const result = await fetch(`http://localhost:4000/setTime`, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ hour, min, sec }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            message: "Successfully set the time",
        };
    }
    else {
        return { success: false, message: "Failed to set the time" };
    }
}
// Tracking Functions
export async function get_tracking_mode() {
    const result = await fetch(`http://localhost:4000/getTrackingMode`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            tracking_mode: flaskJson.tracking_mode,
        };
    }
    else {
        return { success: false, tracking_mode: "" };
    }
}
export async function set_tracking_mode(tracking_mode) {
    const result = await fetch(`http://localhost:4000/setTrackingMode`, {
        method: "POST",
        headers: {
            "Content-Type": "applicaton/json",
        },
        body: JSON.stringify({ tracking_mode }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            message: "Successfully set the tracking mode",
        };
    }
    else {
        return { success: false, message: "Failed to set the tracking mode" };
    }
}
// Sync Functions
export async function sync_ra_dec(ra, dec) {
    const result = await fetch(`http://localhost:4000/syncRaDec`, {
        method: "POST",
        headers: {
            "Content-Type": "applicaton/json",
        },
        body: JSON.stringify({ ra, dec }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            message: "Successfully synced Ra/Dec mode",
        };
    }
    else {
        return { success: false, message: "Failed to sync Ra/Dec" };
    }
}
export async function sync_precise_ra_dec(ra, dec) {
    const result = await fetch(`http://localhost:4000/syncPreciseRaDec`, {
        method: "POST",
        headers: {
            "Content-Type": "applicaton/json",
        },
        body: JSON.stringify({ ra, dec }),
    });
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            message: "Successfully synced Ra/Dec mode",
        };
    }
    else {
        return { success: false, message: "Failed to sync Ra/Dec" };
    }
}
// Device Tools                                                                     //! Not Tested From Here
export async function get_device_version() {
    const result = await fetch(`http://localhost:4000/getDeviceVersion`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            version: flaskJson.device_version,
        };
    }
    else {
        return { success: false, version: "" };
    }
}
export async function get_device_model() {
    const result = await fetch(`http://localhost:4000/getDeviceModel`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return {
            success: true,
            model_name: flaskJson.device_model_name,
            model_value: flaskJson.device_model_value,
        };
    }
    else {
        return { success: false, model_name: "", model_value: "" };
    }
}
// Common Telescope Tools
export async function is_connected() {
    const result = await fetch(`http://localhost:4000/isConnected`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, connected: flaskJson.is_connected };
    }
    else {
        return { success: false, connected: false };
    }
}
export async function is_aligned() {
    const result = await fetch(`http://localhost:4000/isAligned`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, aligned: flaskJson.is_aligned };
    }
    else {
        return { success: false, aligned: false };
    }
}
export async function is_goto_in_progress() {
    const result = await fetch(`http://localhost:4000/isGotoInProgress`);
    const flaskJson = await result.json();
    if (flaskJson.success) {
        return { success: true, goto_in_progress: flaskJson.is_goto_in_progress };
    }
    else {
        return { success: false, goto_in_progress: false };
    }
}
