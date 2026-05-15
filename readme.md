# CivicLens AI 🚀

AI-Powered Civic Issue Detection & Smart Urban Monitoring Platform

---

# 📌 Overview

CivicLens AI is an intelligent civic issue detection and management system designed to help citizens report urban infrastructure problems such as potholes, garbage dumps, water logging, and road damages using AI-powered image analysis and geospatial intelligence.

The platform enables authorities to efficiently monitor, manage, and resolve civic complaints through real-time dashboards, heatmaps, notifications, and analytics.

---

# ✨ Key Features

## 👤 User Features

* User Registration & Authentication
* Upload Civic Issue Images
* AI-Based Issue Classification
* Duplicate Complaint Detection
* Nearby Complaint Detection
* Complaint Tracking & History
* Notifications & Status Updates
* Gamification & Leaderboards

---

## 🛠 Admin Features

* Centralized Complaint Management
* Dashboard Analytics
* Heatmaps & Geo Intelligence
* Complaint Verification Workflow
* User & Subadmin Management
* Area-wise Complaint Insights

---

## 👨‍🔧 Subadmin Features

* View Active Complaints
* Update Complaint Status
* Upload Resolution Proof Images
* Resolution Timeline Tracking

---

# 🧠 AI Capabilities

* Real-time Civic Issue Detection
* AI Classification using YOLOv8
* Smart Duplicate Detection
* Spatial Clustering with PostGIS
* Heatmap & Hotspot Analysis

---

# 🗺 Geospatial Features

* PostGIS Integration
* GeoJSON APIs
* Heatmaps
* Complaint Clustering
* Hotspot Detection
* Nearby Complaint Search

---

# 🛠 Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Mapbox GL JS

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL
* PostGIS

## Authentication

* JWT Authentication
* HTTPOnly Cookies

## AI / ML

* YOLOv8
* FastAPI
* OpenCV

---

# 📂 Project Architecture

```text
Frontend (React + Mapbox)
        ↓
Backend APIs (Node.js + Express)
        ↓
PostgreSQL + PostGIS
        ↓
AI Service (YOLOv8 + FastAPI)
```

---

# 👥 Team Details

## Team Name

**Team GPT**

---

## Team Members

| Sl No | Name                 | USN        |
| ----- | -------------------- | ---------- |
| 1     | Tarun G              | 1BM25MC099 |
| 2     | Vijeth V             | 1BM25MC107 |
| 3     | Shravan S Babu       | 1BM25MC086 |
| 4     | Yashas M             | 1BM25MC112 |
| 5     | Navneeth Gowda G     | 1BM25MC061 |
| 6     | Muhammed Fadhi T     | 1BM25MC059 |
| 7     | Vijayalaxmi Hadimani | 1BM25MC106 |
| 8     | Suhas E              | 1BM25MC095 |

---

# ⚙️ Backend Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/tharunnaidug/BMSCE-HACK-TeamGPT-CivicLens-AI
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env`

```env
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/civiclens

JWT_SECRET=your_secret_key
```

---

## 4️⃣ Start Server

```bash
npm run dev
```

---

# 🔑 Default Test Accounts

## 👨‍💼 Super Admin

```text
Email    : admin@civiclens.com
Password : admin123
```

---

## 👨‍🔧 Sub Admin

```text
Email    : subadmin1@civiclens.com
Password : 123456
```

---

# 📡 Core Backend Features Implemented

* JWT Authentication
* Role-Based Access
* Complaint Lifecycle Management
* Complaint History Tracking
* Notifications System
* Heatmap APIs
* GeoJSON APIs
* Dashboard Analytics
* Gamification System
* Duplicate Detection
* Spatial Intelligence APIs
* Validation Middleware
* Global Error Handling

---

# 🚀 Future Enhancements

* Real-Time Socket.IO Updates
* Mobile Application
* AI Severity Prediction
* Ward-Level Analytics
* Smart Recommendation Engine
* Government Department Integration

---

# 📜 License

This project is developed for Hackathon/Academic purposes.