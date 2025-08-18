import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  get_precise_ra_and_dec,
  get_ra_and_dec,
  getRaAndDec,
  move_to_ra_and_dec,
  move_precise_to_ra_and_dec,
  cancel_goto_movement,
  move_to_azm_and_alt,
  move_precise_to_azm_and_alt,
  get_azm_and_alt,
  get_precise_azm_and_alt,
  slew_azm_variable,
  slew_alt_variable,
  slew_variable,
  slew_azm_fixed,
  slew_alt_fixed,
  slew_fixed,
  slew_stop,
  get_location,
  set_location,
  get_time,
  set_time,
  get_tracking_mode,
  set_tracking_mode,
  sync_ra_dec,
  sync_precise_ra_dec,
  get_device_version,
  get_device_model,
  is_connected,
  is_aligned,
  is_goto_in_progress,
} from "./utils/telescope.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({
  name: "vision-cosmos",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// Get RA/Dec from AstronomyAPI
server.tool(
  "get_ra_and_dec_astronomyapi",
  "Get RA/DEC of a celestial body",
  {
    planet: z.string().describe("Name of the celestial body"),
    location: z.object({
      latitude: z.number().describe("Latitude of observer"),
      longitude: z.number().describe("Longitude of observer"),
    }),
  },
  async ({ planet, location }) => {
    try {
      if (!process.env.APP_ID || !process.env.APP_SECRET) {
        throw new Error("Missing API credentials");
      }

      const result = await getRaAndDec(planet, location);
      if (result.ra === 0 && result.dec === 0) {
        throw new Error(
          "Could not determine coordinates for the specified body"
        );
      }

      return {
        content: [
          {
            type: "text",
            text: `RA: ${result.ra}, DEC: ${result.dec}`,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while fetching RA/DEC.",
          },
        ],
      };
    }
  }
);

//? Move Tools
// Move telescope to specified RA/DEC
server.tool(
  "move_to_ra_and_dec",
  "Move telescope to specified RA/DEC",
  {
    ra: z.number().describe("Right Ascension in hours"),
    dec: z.number().describe("Declination in degrees"),
  },
  async ({ ra, dec }) => {
    try {
      const result = await move_to_ra_and_dec(ra, dec);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Move telescope to precise RA/DEC
server.tool(
  "move_to_ra_and_dec_precise",
  "Move telescope to precise RA/DEC",
  {
    ra: z.number().describe("Right Ascension in hours"),
    dec: z.number().describe("Declination in degrees"),
  },
  async ({ ra, dec }) => {
    try {
      const result = await move_precise_to_ra_and_dec(ra, dec);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Move telescope to specific Azm/Alt
server.tool(
  "move_to_azm_and_alt",
  "Move telescope to specified Azm/Alt",
  {
    azm: z.number().describe("Right Ascension in hours"),
    alt: z.number().describe("Declination in degrees"),
  },
  async ({ azm, alt }) => {
    try {
      const result = await move_to_azm_and_alt(azm, alt);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Move telescope to precise Azm/Alt
server.tool(
  "move_to_azm_and_alt_precise",
  "Move telescope to precise AZM/ALT",
  {
    azm: z.number().describe("Right Ascension in hours"),
    alt: z.number().describe("Declination in degrees"),
  },
  async ({ azm, alt }) => {
    try {
      const result = await move_precise_to_azm_and_alt(azm, alt);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Cancel Goto Movement
server.tool(
  "stop_telescope_movement",
  "Cancels the current goto operation",
  {},
  async () => {
    try {
      const result = await cancel_goto_movement();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

//? Get Ra/Dec & Azm/Alt Tools
// Get current RA/DEC from telescope
server.tool(
  "get_current_ra_and_dec_from_telescope",
  "Get Telescope coordinates RA/DEC",
  z.object({}).shape,
  async () => {
    try {
      const result = await get_ra_and_dec();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Ra:${result.ra} And Dec:${result.dec}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get coordinates`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Get precise RA/DEC from telescope
server.tool(
  "get_current_precise_ra_and_dec_from_telescope",
  "Get Precise Telescope coordinates RA/DEC",
  z.object({}).shape,
  async () => {
    try {
      const result = await get_precise_ra_and_dec();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Ra:${result.ra} And Dec:${result.dec}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get coordinates`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Get current AZM/ALT from telescope
server.tool(
  "get_current_azm_and_alt_from_telescope",
  "Get Telescope coordinates AZM/ALT",
  z.object({}).shape,
  async () => {
    try {
      const result = await get_azm_and_alt();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Azm:${result.azm} And Alt:${result.alt}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get coordinates`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Get precise Azm/Alt from telescope
server.tool(
  "get_current_precise_azm_and_alt_from_telescope",
  "Get Precise Telescope coordinates AZM/ALT",
  z.object({}).shape,
  async () => {
    try {
      const result = await get_precise_azm_and_alt();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Azm:${result.azm} And Alt:${result.alt}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get coordinates`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

//? Slew Movement Tools
// Slew to Azm
server.tool(
  "slew_to_azm",
  "Slew the telescope at a variable rate in azimuth",
  {
    rate: z
      .number()
      .describe(
        "The variable slew rate in arcseconds/second, negative values are reverse"
      ),
  },
  async ({ rate }) => {
    try {
      const result = await slew_azm_variable(rate);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Slew to Alt
server.tool(
  "slew_to_alt",
  "Slew the telescope at a variable rate in altitude",
  {
    rate: z
      .number()
      .describe(
        "The variable slew rate in arcseconds/second, negative values are reverse"
      ),
  },
  async ({ rate }) => {
    try {
      const result = await slew_alt_variable(rate);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Slew to Azm/Alt
server.tool(
  "slew_to_azm_and_alt",
  "Slew the telescope at a variable rate in azimuth and altitude simultaneously",
  {
    azm_rate: z
      .number()
      .describe(
        "The variable slew rate in arcseconds/second for azimuth, negative values are reverse"
      ),
    alt_rate: z
      .number()
      .describe(
        "The variable slew rate in arcseconds/second for altitude, negative values are reverse"
      ),
  },
  async ({ azm_rate, alt_rate }) => {
    try {
      const result = await slew_variable(azm_rate, alt_rate);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Slew to Fixed Azm
server.tool(
  "slew_to_fixed_azm",
  "Slew the telescope at a fixed rate in azimuth",
  {
    rate: z
      .number()
      .describe(
        "The fixed slew rate to use [-9, 9] where 0 is stop and negative values are reverse"
      )
      .max(9)
      .min(-9),
  },
  async ({ rate }) => {
    try {
      const result = await slew_azm_fixed(rate);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Slew to Fixed Alt
server.tool(
  "slew_to_fixed_alt",
  "Slew the telescope at a fixed rate in altitude",
  {
    rate: z
      .number()
      .describe(
        "The fixed slew rate to use [-9, 9] where 0 is stop and negative values are reverse"
      )
      .max(9)
      .min(-9),
  },
  async ({ rate }) => {
    try {
      const result = await slew_alt_fixed(rate);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Slew to Fixed Azm/Alt
server.tool(
  "slew_to_fixed_azm_and_alt",
  "Slew the telescope at a fixed rate in azimuth and altitude simultaneously",
  {
    azm_rate: z
      .number()
      .describe(
        "The fixed slew rate to use in azimuth [-9, 9] where 0 is stop and negative values are reverse"
      ),
    alt_rate: z
      .number()
      .describe(
        "The fixed slew rate to use in altitude [-9, 9] where 0 is stop and negative values are reverse"
      ),
  },
  async ({ azm_rate, alt_rate }) => {
    try {
      const result = await slew_fixed(azm_rate, alt_rate);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while moving the telescope.",
          },
        ],
      };
    }
  }
);

// Stop Slew Movement
server.tool(
  "stop_slew_movement",
  "Stops the telescope from slewing in both azimuth and altitude",
  {},
  async () => {
    try {
      const result = await slew_stop();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${result.message}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while stopping the slew movement.",
          },
        ],
      };
    }
  }
);

//? Location Tools
// Get current location of the telescope
server.tool(
  "get_current_location",
  "Returns the current location of the telescope",
  z.object({}).shape,
  async () => {
    try {
      const result = await get_location();
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Current Location - Latitude: ${result.latitude}, Longitude: ${result.longitude}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Failed to get current location: ${result.latitude}, ${result.longitude}`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while getting the current location.",
          },
        ],
      };
    }
  }
);

// Set location of the telescope
server.tool(
  "set_location",
  "Sets the location of the telescope",
  {
    latitude: z.number().describe("The latitude of the telescope"),
    longitude: z.number().describe("The longitude of the telescope"),
  },
  async ({ latitude, longitude }) => {
    try {
      const result = await set_location(latitude, longitude);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while setting the location.",
          },
        ],
      };
    }
  }
);

//? Time Tools
// Get current time of the telescope
server.tool(
  "get_current_time",
  "Returns the current time of the telescope",
  z.object({}).shape,
  async () => {
    try {
      const currentTime = await get_time();
      if (currentTime) {
        return {
          content: [
            {
              type: "text",
              text: `Time: ${currentTime.time}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: "Failed to get time from telescope.",
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while getting the current time.",
          },
        ],
      };
    }
  }
);

// Set time of the telescope
server.tool(
  "set_time",
  "Sets the time of the telescope",
  {
    hour: z.number().describe("The hour to set on the telescope"),
    minute: z.number().describe("The minute to set on the telescope"),
    second: z.number().describe("The second to set on the telescope"),
  },
  async ({ hour, minute, second }) => {
    try {
      const result = await set_time(hour, minute, second);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while setting the time.",
          },
        ],
      };
    }
  }
);

//? Tracking Tools
// Get the current tracking state of the telescope
server.tool(
  "get_tracking_state",
  "Returns the current tracking mode",
  z.object({}).shape,
  async () => {
    try {
      const trackingState = await get_tracking_mode();
      if (trackingState.success) {
        return {
          content: [
            {
              type: "text",
              text: `Tracking Mode: ${trackingState.tracking_mode}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Failed to get tracking state`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while getting the tracking state.",
          },
        ],
      };
    }
  }
);

// Set the tracking state of the telescope
server.tool(
  "set_tracking_state",
  "Sets the tracking state of the telescope",
  {
    tracking_mode: z
      .string()
      .describe("The tracking mode to set on the telescope"),
  },
  async ({ tracking_mode }) => {
    try {
      const result = await set_tracking_mode(tracking_mode);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while setting the tracking state.",
          },
        ],
      };
    }
  }
);

//? Sync Tools
// Sync RA/DEC with Telescope
server.tool(
  "sync_ra_and_dec",
  "Syncs the telescope to the specified right ascension and declination position in degrees",
  {
    ra: z.number().describe("The right ascension position in degrees"),
    dec: z.number().describe("The declination position in degrees"),
  },
  async ({ ra, dec }) => {
    try {
      const result = await sync_ra_dec(ra, dec);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error syncing RA/DEC`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while syncing RA/DEC.",
          },
        ],
      };
    }
  }
);

// Sync Precise RA/DEC with Telescope
server.tool(
  "sync_precise_ra_and_dec",
  "Syncs the telescope to the specified right ascension and declination position in degrees with highest precision",
  {
    ra: z.number().describe("The precise right ascension position in degrees"),
    dec: z.number().describe("The precise declination position in degrees"),
  },
  async ({ ra, dec }) => {
    try {
      const result = await sync_precise_ra_dec(ra, dec);
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error syncing precise RA/DEC`,
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while syncing precise RA/DEC.",
          },
        ],
      };
    }
  }
);

//? Device Information Tools
// Get device Version
server.tool(
  "get_device_version",
  "Returns the device version",
  {},
  async () => {
    try {
      const data = await get_device_version();
      if (data) {
        return {
          content: [
            {
              type: "text",
              text: `Device Version: ${data.version}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "Failed to get device version.",
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while getting device version.",
          },
        ],
      };
    }
  }
);

//Get devive model
server.tool("get_device_model", "Returns the device model", {}, async () => {
  try {
    const data = await get_device_model();
    if (data) {
      return {
        content: [
          {
            type: "text",
            text: `Device Model Name: ${data.model_name}, Device Model Value: ${data.model_value}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: "Failed to get device model.",
          },
        ],
      };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err.message}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: "An unexpected error occurred while getting device model.",
        },
      ],
    };
  }
});

//? Common Telescope Tools
// Check if the telescope is connected
server.tool(
  "is_telescope_connected",
  "Checks if the telescope is connected",
  z.object({}).shape,
  async () => {
    try {
      const isConnected = await is_connected();
      if (isConnected) {
        return {
          content: [
            {
              type: "text",
              text: "Telescope is connected.",
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "Telescope is not connected.",
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while checking telescope connection.",
          },
        ],
      };
    }
  }
);

// Check if the telescope is aligned
server.tool(
  "is_telescope_aligned",
  "Checks if the telescope is aligned",
  z.object({}).shape,
  async () => {
    try {
      const isAligned = await is_aligned();
      if (isAligned) {
        return {
          content: [
            {
              type: "text",
              text: "Telescope is aligned.",
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "Telescope is not aligned.",
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while checking telescope alignment.",
          },
        ],
      };
    }
  }
);

// Check if the telescope goto is in progress
server.tool(
  "is_telescope_goto_in_progress",
  "Checks if the telescope is currently performing a goto operation",
  z.object({}).shape,
  async () => {
    try {
      const isGotoInProgress = await is_goto_in_progress();
      if (isGotoInProgress) {
        return {
          content: [
            {
              type: "text",
              text: "Telescope is currently performing a goto operation.",
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "Telescope is not performing a goto operation.",
            },
          ],
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "An unexpected error occurred while checking telescope goto status.",
          },
        ],
      };
    }
  }
);

let id = 0;

// Main function
async function main() {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => String(++id),
  });
  await server.connect(transport);
  console.error("Vision Cosmos MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
