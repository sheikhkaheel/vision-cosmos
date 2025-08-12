import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { get_precise_ra_and_dec, get_ra_and_dec, getRaAndDec, move_to_ra_and_dec, move_precise_to_ra_and_dec, handle_goto_telescope, cancel_goto_movement, } from "./utils/telescope.js";
const server = new McpServer({
    name: "vision-cosmos",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    },
});
// get RA/Dec from AstronomyAPI
server.tool("get_ra_and_dec_astronomyapi", "Get RA/DEC of a celestial body", {
    planet: z.string().describe("Name of the celestial body"),
    location: z.object({
        latitude: z.number().describe("Latitude of observer"),
        longitude: z.number().describe("Longitude of observer"),
    }),
}, async ({ planet, location }) => {
    try {
        if (!process.env.APP_ID || !process.env.APP_SECRET) {
            throw new Error("Missing API credentials");
        }
        const result = await getRaAndDec(planet, location);
        if (result.ra === 0 && result.dec === 0) {
            throw new Error("Could not determine coordinates for the specified body");
        }
        return {
            content: [
                {
                    type: "text",
                    text: `RA: ${result.ra}, DEC: ${result.dec}`,
                },
            ],
        };
    }
    catch (err) {
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
});
// move telescope to specified RA/DEC
server.tool("move_to_ra_and_dec", "Move telescope to specified RA/DEC", {
    ra: z.number().describe("Right Ascension in hours"),
    dec: z.number().describe("Declination in degrees"),
}, async ({ ra, dec }) => {
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
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${result.message}`,
                    },
                ],
            };
        }
    }
    catch (err) {
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
});
// move telescope to precise RA/DEC
server.tool("move_to_ra_and_dec_precise", "Move telescope to precise RA/DEC", {
    ra: z.number().describe("Right Ascension in hours"),
    dec: z.number().describe("Declination in degrees"),
}, async ({ ra, dec }) => {
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
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${result.message}`,
                    },
                ],
            };
        }
    }
    catch (err) {
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
});
// get current RA/DEC from telescope
server.tool("get_current_ra_and_dec_from_telescope", "Get Telescope coordinates RA/DEC", z.object({}).shape, async () => {
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
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: Failed to get coordinates`,
                    },
                ],
            };
        }
    }
    catch (err) {
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
});
// get precise RA/DEC from telescope
server.tool("get_current_precise_ra_and_dec_from_telescope", "Get Precise Telescope coordinates RA/DEC", z.object({}).shape, async () => {
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
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: Failed to get coordinates`,
                    },
                ],
            };
        }
    }
    catch (err) {
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
});
// handle telescope movement
server.tool("handle_move_to_ra_and_dec", "Move telescope to specified RA/DEC", {
    ra: z.number().describe("Right Ascension in hours"),
    dec: z.number().describe("Declination in degrees"),
    isPrecise: z
        .boolean()
        .optional()
        .default(false)
        .describe("Whether to move precisely"),
}, async ({ ra, dec, isPrecise }) => {
    try {
        const result = await handle_goto_telescope(ra, dec, isPrecise);
        if (result.success) {
            return {
                content: [
                    {
                        type: "text",
                        text: result.message,
                    },
                ],
            };
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${result.message}`,
                    },
                ],
            };
        }
    }
    catch (err) {
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
});
// stop telescope movement
server.tool("stop_telescope_movement", "Cancels the current goto operation", {}, async () => {
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
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${result.message}`,
                    },
                ],
            };
        }
    }
    catch (err) {
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
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Vision Cosmos MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
