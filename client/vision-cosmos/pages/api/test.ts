// pages/api/planet.ts
import { fork, spawn } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const out = await runPythonProgram();
  return res.status(200).json({ result: out });
}

function runPythonProgram() {
  let out = "";
  let err = "";

  return new Promise((resolve, reject) => {
    const child = spawn(
      "/home/sheikh-muhammad-kaheel/Programming/Main Projects/vision-cosmos/hw.py",
      ["001", "002"]
    );

    child.stdout.on("data", (data) => {
      out += data;
    });

    child.stderr.on("data", (data) => {
      err += data;
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) resolve(out);
      reject(err);
    });
  });
}
