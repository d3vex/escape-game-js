const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Endpoint pour récupérer le leaderboard
app.get("/api/leaderboard", (req, res) => {
    try {
        const leaderboardPath = path.join(__dirname, "data/leaderboard.json");
        const leaderboardData = fs.readFileSync(leaderboardPath, "utf8");
        const leaderboard = JSON.parse(leaderboardData);

        // Trier le leaderboard par temps restant (décroissant)
        leaderboard.sort((a, b) => b.time - a.time);

        res.json(leaderboard);
    } catch (error) {
        console.error("Error reading leaderboard:", error);
        res.status(500).json({ error: "Failed to read leaderboard" });
    }
});

// Endpoint pour ajouter un nouveau score au leaderboard
app.post("/api/leaderboard", (req, res) => {
    try {
        const { pseudo, time } = req.body;

        if (!pseudo || time === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const leaderboardPath = path.join(__dirname, "data/leaderboard.json");
        const leaderboardData = fs.readFileSync(leaderboardPath, "utf8");
        const leaderboard = JSON.parse(leaderboardData);

        // Ajouter le nouveau score
        leaderboard.push({ pseudo, time: parseInt(time) });

        // Trier et limiter à 10 scores si nécessaire
        leaderboard.sort((a, b) => b.time - a.time);
        const topScores = leaderboard.slice(0, 10);

        // Sauvegarder le leaderboard mis à jour
        fs.writeFileSync(leaderboardPath, JSON.stringify(topScores, null, 2));

        res.json({ success: true, message: "Score added to leaderboard" });
    } catch (error) {
        console.error("Error updating leaderboard:", error);
        res.status(500).json({ error: "Failed to update leaderboard" });
    }
});

app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});