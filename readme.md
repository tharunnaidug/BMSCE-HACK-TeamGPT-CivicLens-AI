# CivicLens AI

AI-Powered Civic Issue Detection & Tracking System

---

## Team Details

### Team Name
Team GPT

---

## Team Members

| Sl No | Name | USN
|---|---|
| 1 | Tarun G | 1BM25MC099
| 2 | Vijeth V | 1BM25MC107
| 3 | Shravan S Babu | 1BM25MC086
| 4 | Yashas M | 1BM25MC112
| 5 | Navneeth Gowda G | 1BM25MC061
| 6 | Muhammed Fadhi T | 1BM25MC059
| 7 | Vijayalaxmi Hadimani | 1BM25MC106
| 8 | Suhas E | 1BM25MC095

---

# Project Overview

CivicLens AI is an intelligent civic issue detection and management platform that enables citizens to report issues such as potholes, garbage dumps, road cracks, and water logging using AI-powered image classification and geospatial duplicate detection.

The platform uses:
- AI-based classification
- PostgreSQL + PostGIS
- GeoJSON APIs
- Heatmaps & live mapping
- Role-based admin management
- Complaint tracking workflow

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL
- PostGIS

## Authentication
- JWT

## AI
- YOLOv8 / FastAPI

## Maps
- Mapbox

---

# Features

- User registration/login
- AI complaint classification
- Duplicate complaint detection
- Nearby issue detection
- GeoJSON APIs
- Admin/Subadmin management
- Complaint timeline/history
- Heatmap integration
- Role-based access

---

# Setup Instructions

## Install Dependencies

npm install

Create .env

PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/civiclens

JWT_SECRET=your_secret_key