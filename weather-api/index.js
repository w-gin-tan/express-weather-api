require('dotenv').config();

const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome! Navigate to /weather to see the weather data.');
});

app.get('/weather', (req, res) => {
    res.json({
        city: 'Perth',
        temperature: 22,
        condition: 'Sunny'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
