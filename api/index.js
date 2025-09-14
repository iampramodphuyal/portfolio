export default function handler(req, res) {
    const userAgent = req.headers["user-agent"] || "";

    if (userAgent.includes("curl")) {
        // Return your API response for curl

        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(`#!/bin/bash
echo "====================================="
echo "  Welcome to My CLI Portfolio 🚀"
echo "====================================="
echo ""
echo "Name: Your Name"
echo "Role: Software Developer"
echo "Site: https://your-site.vercel.app"
`);
    } else {
        // For browsers, serve the React app
        // Read and serve the built index.html
        const fs = require("fs");
        const path = require("path");

        try {
            const htmlPath = path.join(process.cwd(), "build", "index.html");
            const html = fs.readFileSync(htmlPath, "utf8");
            res.setHeader("Content-Type", "text/html");
            res.send(html);
        } catch (error) {
            res.status(404).send("Not found");
        }
    }
}
