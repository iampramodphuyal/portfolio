import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const ua = (req.headers["user-agent"] || "").toLowerCase();

    // Only serve script to curl requests
    if (ua.includes("curl")) {
        const cardPath = path.join(process.cwd(), 'api', 'card.sh');
        const card = fs.readFileSync(cardPath, 'utf-8');
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.status(200).send(card);
    } else {
        // Fallback for browsers
        res.redirect("/");
    }
}
