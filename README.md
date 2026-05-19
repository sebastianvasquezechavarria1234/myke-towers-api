# 🎤 Myke Towers Full-Stack Application & Professional API

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg?style=flat-square)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.0.0-cyan.svg?style=flat-square)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/express-5.2.1-green.svg?style=flat-square)](https://expressjs.com/)
[![TailwindCSS Version](https://img.shields.io/badge/tailwindcss-4.0.17-orange.svg?style=flat-square)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg?style=flat-square)](LICENSE)

An optimized, premium full-stack web platform dedicated to the legendary urban artist **Myke Towers**. This project pairs a stunning, responsive React frontend interface with a feature-rich, high-performance Express.js backend API that delivers career biography, statistics, local discography data, dynamic iTunes database synchronization, and automated YouTube video scraping with server-side caching.

---

## 🌟 Key Features

### 💻 Frontend (React & Vite)
*   **Modern Interactive UI:** Smooth transitions, responsive grids, and fluid visual animations powered by **Framer Motion**.
*   **Styled Components:** Premium layout styling leveraging **TailwindCSS 4** and Lucide React icons.
*   **Routing System:** Fast, declarative routing using **React Router v7**.
*   **Dynamic Landing Pages:** Beautiful custom sections for the Hero header, social wall, video gallery, and highly detailed interactive album views.

### 🔌 Backend API (Express.js)
*   **Self-Ping Keep-Alive System:** Automatically detects when deployed in production (e.g., Render) and runs a lightweight `setInterval` routine to ping itself, preventing the application from idling or cold starting on free tiers.
*   **Robust Caching:** Utilizes `node-cache` to store heavy YouTube channel and account operations for 1 hour, minimizing API requests and maximizing performance.
*   **Prettified Native Responses:** Serves structured JSON automatically formatted with a 2-space indentation using `app.set('json spaces', 2)` for optimal debugging and readability.
*   **iTunes API Integration:** Dynamically fetches and sorts Myke Towers' real-time discography directly from Apple's servers, formatting covers to maximum resolution (`1000x1000px`).
*   **Dynamic Video Querying:** Live crawling and mapping of YouTube videos with metadata categorization (e.g., Official Video, Live, Lyric Video, Behind the Scenes).

---

## 🏗️ Architecture & Project Directory

```bash
myke-towers-fullstack/
├── index.js               # Main Express.js backend server entry point
├── db.json                # Local JSON database (discography, tracklists, social wall)
├── package.json           # Project manifests, commands, and dependency tree
├── vite.config.js         # Vite bundler configuration
├── index.html             # Single Page Application entry point
├── public/                # Static public assets
└── src/                   # React.js SPA Frontend
    ├── main.jsx           # Frontend entry mount point
    ├── App.jsx            # Main React layout structure
    ├── App.css            # Base stylesheet
    ├── index.css          # Tailwind CSS global configurations & variables
    ├── landing/           # React page modules & components
    │   ├── pages/         # High-level route views (AlbumDetail.jsx, ApiDocs.jsx, etc.)
    │   └── components/    # Reusable sections (Hero, Header, VideoGallery, etc.)
    └── routers/           # Frontend route definitions
```

---

## 🚦 Getting Started

### 📋 Prerequisites
*   [Node.js](https://nodejs.org/) (Version v18.0.0 or higher recommended)
*   [npm](https://www.npmjs.com/) (installed automatically with Node)

### ⚙️ Installation
Clone the repository and install all required frontend and backend dependencies:
```bash
git clone https://github.com/sebastianvasquezechavarria1234/myke-towers-api.git
cd myke-towers-api
npm install
```

### 🏃 Running Locally

The project includes convenient scripts to run the stack concurrently or independently:

#### ⚡ Run Both (Frontend & Backend Concurrently)
The most convenient way to develop locally. Runs the Express API and the Vite Dev server at the same time:
```bash
npm run dev:all
```
*   **Frontend Developer Server:** `http://localhost:5173`
*   **Express API Server:** `http://localhost:3000`

#### 📡 Run Express API Server Only
```bash
npm run server
# or
npm start
```
Starts the backend Express server listening on `http://localhost:3000`.

#### 🎨 Run React Frontend Only
```bash
npm run dev
```
Starts the Vite dev server for client-side styling on `http://localhost:5173`.

---

## 📡 API Endpoints Reference

The backend API exposes the following endpoints (all returning beautiful pretty-printed JSON):

| Endpoint | Method | Description | Cache Status |
| :--- | :--- | :--- | :--- |
| `/?` | `GET` | **API Welcome:** Returns metadata, description, and list of available endpoints. | ❌ None |
| `/healthcheck` | `GET` | **Health & Keep-Alive Check:** Hidden lightweight endpoint returning status `alive` to prevent idling. | ❌ None |
| `/historia` | `GET` | **Biography:** Returns Myke Towers' real name, background, genres, biography text, and achievements. | ❌ None |
| `/stats` | `GET` | **Career Statistics:** Returns monthly listener highlights, top hits, main albums, and nicknames. | ❌ None |
| `/canal` | `GET` | **YouTube Channel Stats:** Returns official subscriber name, channel URL, thumbnail, and total videos. | ⚡ Cached (1 Hour) |
| `/videos` | `GET` | **Video Crawler:** Scrapes the top 30 official, live, and lyric videos with computed metadata. | ⚡ Cached (1 Hour) |
| `/social` | `GET` | **Social Wall:** Fetches Instagram grid posts, item configurations, and dynamic media from local DB. | ❌ None |
| `/albums` | `GET` | **Discography:** Returns complete catalog of albums, EPs, mixtapes, release years, cover art, and descriptions. | ❌ None |
| `/albums/:id/songs` | `GET` | **Album Tracklist:** Retrieves the detailed track metadata and song durations for a specific `:id`. | ❌ None |
| `/dynamic-albums` | `GET` | **Real-time iTunes Sync:** Dynamically fetches latest 100 collections from Apple's iTunes directory. | ❌ None |

---

## 🛡️ Production & Performance Optimizations

### 1. Zero Cold Starts / Render Sleep Prevention
Free tiers on cloud platforms like **Render**, **Koyeb**, or **Glitch** put applications into an "idle state" after 15 minutes of inactivity. To solve this, the server utilizes a built-in self-ping automation:
*   In production, the backend detects its own public domain via `process.env.RENDER_EXTERNAL_URL` (automatically injected by Render).
*   If found, the server triggers a `setInterval` loop every **10 minutes** to query its own hidden lightweight `/healthcheck` route.
*   This triggers the load balancer, indicating incoming traffic and keeping the application awake **24/7** for an instant, responsive user experience.

### 2. Fast Render Speeds with server-side Caching
API routes that depend on external scrapers (`/canal`, `/videos`) utilize `node-cache` configured with a standard TTL of **3600 seconds (1 hour)**. Repeated calls do not scrape YouTube repeatedly, guaranteeing:
*   Response times drop from ~2.5 seconds down to **2 milliseconds** for cached routes.
*   Zero risk of getting rate-limited or blocked by external search engines.

### 3. Highly Readable Development & Debugging
The server configuration includes:
```javascript
app.set('json spaces', 2);
```
This forces all JSON outputs to render with automatic indents, allowing developers to inspect data instantly inside the browser window without needing third-party utilities.

---

## 🧪 Building & Previewing Production Bundle

To build and run the production-optimized build of the React frontend application:
```bash
# 1. Compile the production bundle
npm run build

# 2. Preview the built application locally
npm run preview
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed with 🎧 and urban beats for the ultimate fan experience.*
