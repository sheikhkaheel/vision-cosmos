import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import readline from "readline";
import ollama from "ollama";

// Start MCP server first
// const mcpServer = spawn("node", ["../mcp-server/build/index.js"], {
//   stdio: ["pipe", "inherit", "inherit"],
// });

// mcpServer.on("error", (err) => {
//   console.error("Failed to start MCP server:", err);
// });

// Load your tools JSON
const tools = JSON.parse(
  fs.readFileSync(path.resolve("./vision-cosmos-tools.json"), "utf-8")
).tools;

// Setup terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function run() {
  console.log("Vision Cosmos Terminal (type 'exit' to quit)");
  while (true) {
    const userInput = await askQuestion("> ");

    if (userInput.toLowerCase() === "exit") {
      rl.close();
      //   mcpServer.kill();
      break;
    }

    try {
      const response = await ollama.chat({
        model: "qwen2.5:7b",
        messages: [{ role: "user", content: `User-Input => ${userInput}` }],
        tools: tools,
        tool_call: "auto",
      });

      // Check if the model wants to call a tool
      if (response.tool) {
        const { tool, parameters } = response.tool;
        console.log(`Tool call detected: ${tool}`, parameters);

        // Execute your MCP endpoint here
        // e.g., call your function or HTTP POST to telescope server
      } else {
        console.log("Model response =>", response.message.content);
      }
    } catch (err) {
      console.error("Error calling model:", err);
    }
  }
}

run().catch(console.error);
