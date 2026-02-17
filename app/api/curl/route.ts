export const runtime = "nodejs";

import { execSync } from "child_process";
import path from "path";

export async function GET() {
  try {
    const cwd = process.cwd();
    const output = execSync("bash card.sh", {
      cwd,
      env: {
        ...process.env,
        SCRIPT_DIR: path.join(cwd, "public/curl"),
      },
      encoding: "utf-8",
      timeout: 5000,
    });

    return new Response(output, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return new Response("Error generating terminal output\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
