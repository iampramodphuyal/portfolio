export default function handler(req, res) {
    const ua = (req.headers["user-agent"] || "").toLowerCase();

    // Only serve script to curl requests
    if (ua.includes("curl")) {
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
        // Fallback for browsers
        res.redirect("/");
    }
}
