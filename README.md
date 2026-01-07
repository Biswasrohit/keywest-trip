# Key West 2026

A landing page for tracking our 6-day trip to Key West, Florida (January 10-15, 2026).

## Features

- Countdown timer to trip start
- Interactive itinerary with 28 activities across 6 days
- Real-time activity tracking (check off activities as you complete them)
- Name picker to track who completed what
- Live weather widget for Key West
- Interactive map with all locations
- Photo gallery
- Mobile-friendly design

## Tech Stack

- React + Vite
- Tailwind CSS
- Firebase Realtime Database (optional, for syncing across devices)
- Leaflet + OpenStreetMap (free maps)
- Open-Meteo API (free weather)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Enable Real-Time Sync (Optional)

To sync activity check-offs across all friends' devices:

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database (start in test mode)
3. Copy `.env.example` to `.env` and add your Firebase config
4. Restart the dev server

Without Firebase, the app still works using local storage.

## Deploy to Netlify

```bash
npm run build
```

Then drag the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)

## The Crew

- Rohit
- Alex
- Prosin
- Lucas
- Matthew
