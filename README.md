# Express Weather API

This project is a small Express.js weather API that fetches current weather data from the Visual Crossing API, caches responses in Redis.

## What it does

- Exposes a simple endpoint to get weather data for a location
- Uses Redis to cache responses and reduce repeated API calls
- Reads configuration such as API keys and port from environment variables

## Prerequisites

- Node.js installed
- A running Redis server
- A Visual Crossing API key

## Setup

1. Change into the API folder:
   ```bash
   cd weather-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `weather-api` directory with the following variables:
   ```env
   PORT=3000
   VISUAL_CROSSING_API_KEY=your_api_key_here
   REDIS_URL=redis://localhost:6379
   ```

4. Start Redis if it is not already running. For example, with Docker:
   ```bash
   docker run -d -p 6379:6379 redis
   ```

## Run the server

Start the API with:

```bash
node index.js
```

The server will run on the port defined in your `.env` file.

## API endpoints

- `GET /`  
  Returns a welcome message.

- `GET /weather/:location`  
  Fetches weather data for the provided location.

Example:

```bash
curl http://localhost:3000/weather/London
```

The response includes a `source` field that shows whether the data came from the cache (`cache`) or the external API (`api`).
