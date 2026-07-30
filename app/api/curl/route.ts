export const runtime = "nodejs";

import { execFileSync } from "child_process";
import path from "path";

export async function GET() {
  try {
    const cwd = process.cwd();
    const output = execFileSync("bash", ["card.sh"], {
      cwd,
      env: {
        ...process.env,
        SCRIPT_DIR: path.join(cwd, "public/curl"),
      },
      encoding: "utf-8",
      timeout: 5000,
    });

    return new Response(output, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Card is static per deploy; cap the cost of hammering a fork-heavy endpoint.
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Error generating terminal output\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
