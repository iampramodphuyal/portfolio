import { execSync } from 'child_process';
import path from 'path';

export default function handler(req, res) {
    const ua = (req.headers["user-agent"] || "").toLowerCase();

    // Only serve script to curl requests
    if (ua.includes("curl")) {
        const cardPath = path.join(process.cwd(), 'api', 'card.sh');
        const output = execSync(`bash ${cardPath}`).toString();
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.status(200).send(output);
    } else {
        // Fallback for browsers
        res.redirect("/");
    }
}
