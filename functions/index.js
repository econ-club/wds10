const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");

const app = express();
app.use(cors()); // Allow frontend to access API

const keyFilePath = path.join(__dirname, "sheetauth.json");

// Google Sheets Authentication
const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath, 
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

let cachedData = null;
let lastFetched = null;

app.get("/fetchGoogleSheetData", async (req, res) => {
    const currentTime = Date.now();

    if (cachedData && (currentTime - lastFetched) < 3000) {
        console.log("Returning cached data");
        return res.json({ data: cachedData });
    }

    try {
        const spreadsheetId = "1watWnb_z-P-kmFMJ902T-XvZNqNLaXqs3l_xSlVXHzA";
        const range = "Sheet1!A2:C10"; 
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

        const data = response.data.values;
        console.log("Fetched data:", data);

        cachedData = data;
        lastFetched = currentTime;
        res.json({ data });
    } catch (error) {
        console.error("Error fetching Google Sheets data:", error);
        res.status(500).json({ error: "Failed to fetch Google Sheets data" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
