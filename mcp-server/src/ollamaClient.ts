// // src/client.ts
// import readline from "readline";
// import { server } from "./index.js";

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function main() {
//   await server.connect({} as any); // or your transport

//   rl.question("Ask me: ", async (prompt) => {
//     let planet = "";
//     if (prompt.toLowerCase().includes("mars")) planet = "mars";
//     else if (prompt.toLowerCase().includes("jupiter")) planet = "jupiter";

//     if (planet) {
//       const result = await server.callTool("get_ra_and_dec_astronomyapi", {
//         planet,
//         location: { latitude: 28.6139, longitude: 77.209 }, // Example location
//       });
//       console.log(result.content[0].text);
//     } else {
//       console.log("I don't know how to answer that yet.");
//     }
//     rl.close();
//   });
// }

// main().catch(console.error);
