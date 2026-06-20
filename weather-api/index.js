require('dotenv').config();

const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,               // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(limiter);

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

app.get('/', (req, res) => {
    res.send('Welcome! Navigate to /weather/your_location to see the weather data.');
});

// Add redis cache, set up conn string

app.get('/weather/:location', async (req, res) => {
    try {
        const { location } = req.params;

        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/${encodeURIComponent(today)}?key=${API_KEY}&unitGroup=metric&include=current`;

        const response = await axios.get(url);

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: 'Failed to fetch weather data'
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
