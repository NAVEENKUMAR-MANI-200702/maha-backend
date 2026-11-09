# Maha Dairy Products - Centralized Backend

Centralized Node.js, Express, and TypeScript backend for Maha Dairy Products.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Fill in your MongoDB Atlas connection string and Firebase service account path in `.env`.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build & Run for Production
```bash
npm run build
npm start
```

## 🩺 Endpoints
- `GET /` — API welcome message
- `GET /health` — Health check endpoint
