# HRMS Lite

A lightweight Human Resource Management System (HRMS) built with the MERN Stack.

## Features
- **Employee Management**: Add, view, and delete employees.
- **Attendance Tracking**: Mark daily attendance (Present/Absent) and view monthly logs.
- **Responsive UI**: Built with React and Tailwind CSS for a premium feel.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose)

## 🚀 Deployment Guide (Monorepo)

### 1. Backend (Render)
1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click **Advanced** -> **Add Environment Variable**:
   - `MONGO_URI`: Your MongoDB Connection String (from MongoDB Atlas).
7. Deploy! Copy the provided backend URL (e.g., `https://your-app.onrender.com`).

### 2. Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import the same GitHub repository.
4. In **Project Settings**:
   - **Root Directory**: Click Edit and select `client`.
   - **Framework Preset**: Vite (should be auto-detected).
5. Open **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://your-app.onrender.com/api` (The URL from step 1, ensuring `/api` is at the end).
6. Deploy!

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd HRBS
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env file with MONGO_URI
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access App**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5001`
