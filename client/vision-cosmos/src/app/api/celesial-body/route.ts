// app/api/celesial-body/route.ts
import { NextResponse } from "next/server";

const planets: string[] = [
  "moon",
  "earth",
  "sun",
  "mercury",
  "venus",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

function raToHex(raHours: number) {
  const raValue = Math.floor((raHours * 65536) / 24);
  return raValue.toString(16).toUpperCase().padStart(4, "0");
}

function decToHex(decDegrees: number) {
  if (decDegrees < 0) {
    decDegrees = 360 + decDegrees;
  }
  const decValue = Math.floor((decDegrees * 65536) / 360);
  return decValue.toString(16).toUpperCase().padStart(4, "0");
}

export async function POST(request: Request) {
  try {
    const appId = process.env.APP_ID!;
    const appSecret = process.env.APP_SECRET!;

    const body = await request.json(); // ✅ Fix here
    const { planet, location } = body;

    if (!planet || !location) {
      return NextResponse.json(
        { error: "Missing planet or location" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    let ra: number;
    let dec: number;

    console.log("Input =>", planet, location);
    const trimmedBody = planet.trim().toLowerCase();

    let response;

    if (!planets.includes(trimmedBody)) {
      response = await fetch(
        `https://api.astronomyapi.com/api/v2/search?term=${trimmedBody}&match_type=fuzzy`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${appId}:${appSecret}`
            ).toString("base64")}`,
          },
        }
      );
      const data = await response.json();
      const bodyData = data?.data[0];

      ra = parseInt(bodyData?.position?.equatorial?.rightAscension?.hours);
      dec = parseInt(bodyData?.position?.equatorial?.declination?.degrees);
    } else {
      response = await fetch(
        `https://api.astronomyapi.com/api/v2/bodies/positions/${trimmedBody}?latitude=${location.latitude}&longitude=${location.longitude}&elevation=10&from_date=${today}&to_date=${today}&time=12:00:00`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${appId}:${appSecret}`
            ).toString("base64")}`,
          },
        }
      );
      const data = await response.json();
      const cell = data?.data?.table?.rows[0]?.cells[0]?.position?.equatorial;
      ra = parseInt(cell?.rightAscension?.hours);
      dec = parseInt(cell?.declination?.degrees);
    }

    if (
      typeof ra !== "number" ||
      isNaN(ra) ||
      typeof dec !== "number" ||
      isNaN(dec)
    ) {
      console.error("Invalid RA/DEC values", { ra, dec });
      return NextResponse.json(
        {
          ra: "n/a",
          dec: "n/a",
          error: "Invalid Celestial Body",
        },
        { status: 400 }
      );
    }

    console.log("Values Float of Ra / Dec ==>", ra.toFixed(2), dec.toFixed(2));

    const result = await fetch(
      `http://localhost:4000/${ra.toFixed(2)}/${dec.toFixed(2)}`
    );
    const flaskJson = await result.json();
    console.log("Response from the Flask server ==>", flaskJson);

    return NextResponse.json({ ra, dec });
  } catch (err: unknown) {
    console.error("Error caught:", err);
    if (err instanceof Error) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: err.message || "Unknown error",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Unknown error",
      },
      { status: 500 }
    );
  }
}

// let port: SerialPort;

// async function getSerialPort(): Promise<SerialPort> {
//   const ports = await SerialPort.list();

//   if (ports.length === 0) {
//     console.error("No serial ports found!");
//     return new Promise((_, rej) => rej("No serial Port"));
//   }

//   const selectedPort = ports[0].path;
//   console.log("Selected Port =>", selectedPort);

//   if (!port || !port.isOpen) {
//     port = new SerialPort({
//       path: selectedPort,
//       baudRate: 9600,
//       dataBits: 8,
//       stopBits: 1,
//       parity: "none",
//       autoOpen: false,
//       lock: false,
//     });

//     await new Promise<void>((resolve, reject) => {
//       port.open((err) => {
//         if (err) {
//           console.error("Failed to open port:", err.message);
//           reject(err);
//         } else {
//           console.log("Serial port opened");
//           resolve();
//         }
//       });
//     });
//   }

//   return port;
// }

// export async function moveTelescope(raHex: string, decHex: string) {
//   let port: SerialPort;

//   try {
//     port = await getSerialPort();
//   } catch (err: unknown) {
//     if (
//       err instanceof Error &&
//       err.message.includes("Resource temporarily unavailable")
//     ) {
//       console.error("Port is currently locked. Is another process using it?");
//     }
//     console.log("Error =>", err);
//     throw err;
//   }

//   const command = `r${raHex},${decHex}`;

//   return new Promise((resolve, reject) => {
//     let closedProperly = false;
//     let responseReceived = false;

//     const handleError = (msg: string) => {
//       console.error(msg);
//       closePort(() => reject(msg));
//     };

//     const closePort = (callback: () => void) => {
//       if (port && port.isOpen) {
//         port.close((err) => {
//           if (err) {
//             console.error("Error closing port:", err.message);
//             return reject("Failed to close port properly");
//           }
//           console.log("Port closed successfully");
//           closedProperly = true;
//           callback();
//         });
//       } else {
//         callback();
//       }
//     };

//     const sendCommand = () => {
//       port.write(`${command}\r`, (err) => {
//         if (err) {
//           return handleError("Error writing RA/DEC command: " + err.message);
//         }

//         console.log("RA/DEC command sent:", command);

//         // Wait 5 seconds before sending 'L' command to start slew
//         setTimeout(() => {
//           port.write("L\r", (err) => {
//             if (err) {
//               return handleError("Error writing 'L' command: " + err.message);
//             }

//             console.log("Sent 'L' command to move telescope...");

//             // Timeout if no response within 8 seconds
//             const timeoutId = setTimeout(() => {
//               if (!responseReceived) {
//                 console.log("Timeout waiting for response from telescope.");
//                 closePort(() =>
//                   reject(
//                     "Telescope did not respond to GOTO command in time. It may be busy or unresponsive."
//                   )
//                 );
//               }
//             }, 8000);

//             port.once("data", (data) => {
//               responseReceived = true;
//               clearTimeout(timeoutId);

//               const response = data.toString().trim();
//               console.log("Telescope response:", response);

//               // Treat '0' as success and resolve immediately
//               if (response === "0") {
//                 closePort(() =>
//                   resolve({
//                     response,
//                     status: closedProperly ? "Port closed" : "Port not closed",
//                     handleError,
//                   })
//                 );
//               } else {
//                 // For other responses, also resolve but log
//                 console.warn("Unexpected telescope response:", response);
//                 closePort(() =>
//                   resolve({
//                     response,
//                     status: closedProperly ? "Port closed" : "Port not closed",
//                     handleError,
//                   })
//                 );
//               }
//             });

//             port.once("close", () => {
//               console.log("Serial port 'close' event triggered");
//               closedProperly = true;
//             });
//           });
//         }, 5000);
//       });
//     };

//     sendCommand();
//   });
// }
