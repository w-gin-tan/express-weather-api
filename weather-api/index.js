import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";
import rateLimit from "express-rate-limit";
import { createClient } from "redis";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,               // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(limiter);

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

app.get('/', (req, res) => {
    res.send('Welcome! Navigate to /weather/your_location to see the weather data.');
});

app.get('/weather/:location', async (req, res) => {

    const { location } = req.params;

    try {

        // Check redis cache first
        const cachedData = await redisClient.get(location);
        
        if (cachedData) {
            console.log('Cache hit for location:', location);
            return res.json({
                source: "cache",
                data: JSON.parse(cachedData),
            });
        }

        // Call weather data directly, save to Redis for 12 hours
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/${encodeURIComponent(today)}?key=${API_KEY}&unitGroup=metric&include=current`;

        const response = await axios.get(url);

        // Save to Redis for 12 hours
        await redisClient.setEx(location, 43200, JSON.stringify(response.data));

        res.json({
            source: "api",
            data: response.data,
        });
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
