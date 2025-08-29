# Sager Task

A real-time drone tracking system that shows the geo-location data of drones on a map using **WebSocket**.

---

## Features

- Real-time geo-location updates of drones via WebSocket.
- Interactive frontend built with React and TypeScript.
- Map visualization with drone markers, paths, and popups.
- Drone status color indicators.
- Filtering drones by serial number.
- Flight time calculation for each drone.
- Dashboard displaying altitude and yaw statistics over time.
- Responsive and user-friendly UI with Tailwind CSS.

---

## Technologies & Libraries Used

### Backend

- Node.js
- Express
- socket.io

### Frontend

- React.js (v19.1.1)
- TypeScript (v5.8.3)
- react-map-gl (v7.1.9) — Mapbox map integration
- mapbox-gl (v2.15.0)
- recharts — Data visualization with charts
- zustand (v5.0.8) — Lightweight state management (optional)
- react-router-dom (v7.8.2) — Routing
- react-icons (v5.5.0) — Icons
- Tailwind CSS (v4.1.12) — Styling
- postcss (v8.5.6), autoprefixer (v10.4.21) — CSS processing

### Development & Linting

- vite (v7.1.3) — Dev server and build tool
- @vitejs/plugin-react (v5.0.1)
- eslint (v9.34.0) and plugins (@eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh)
- TypeScript ESLint (typescript-eslint v8.41.0)
- @types packages for React, ReactDOM, react-map-gl, recharts

---

## Project Structure

Frontend/
├── src/
│ ├── assets/ # CSS and image assets
│ ├── components/ # Reusable UI components (DroneMarker, DronePopup, DronePath)
│ ├── hooks/ # Custom React hooks (useDronesData, useDroneWebSocket)
│ ├── pages/ # Main pages (DashboardPage, MapPage)
│ ├── utils/ # Utility functions and types (data transforms, color utils)
│ ├── App.tsx # Main React component
│ └── main.tsx # App entry point
Backend/
├── server.js # Express server with socket.io for real-time data
├── data/ # Static or simulated drone data (optional)
├── package.json # Backend dependencies

---

---

## How It Works

### Backend

- Uses **socket.io** to send real-time geo-location data of drones.
- Emits drone updates to connected clients.
- Each drone update includes location, altitude, yaw, and flight time.
- Flight time is calculated based on the first received timestamp per drone.

### Frontend

- Connects to backend WebSocket to receive live updates.
- Uses `react-map-gl` to render drone markers and paths on a Mapbox map.
- Each drone has a popup showing detailed info like altitude and flight time.
- Users can filter drones by their serial number via a dropdown.
- The dashboard page uses **Recharts** to display drone statistics (altitude and yaw) over the drone's path.

---

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- Mapbox Access Token (get one for free at [Mapbox](https://account.mapbox.com/))

### Setup

1. Clone the repository:

```bash
git clone <repo-url>

2. Setup backend:

cd Backend
npm install
npm start

3. Setup frontend:

cd ../Frontend
npm install


4. Create .env file in Frontend root:

VITE_MAPBOX_TOKEN=your_mapbox_token_here


5. Run frontend:

bash
Copy code
npm run dev
```

Available Scripts

Backend

npm start: Start the Express + socket.io server.

Frontend

npm run dev: Run frontend in development mode.

npm run build: Build frontend for production.

npm run lint: Run eslint to check for linting errors.

Troubleshooting

If map tiles do not load, check your Mapbox token and internet connection.

If WebSocket connection fails, ensure backend server is running and accessible.

For TypeScript errors, ensure all dependencies and types are installed.

Contributing

Feel free to open issues or pull requests.
Please follow the existing code style and conventions.
