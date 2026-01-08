# Fullstack Streaming Platform 

A modern, secure, and scalable streaming platform backend built with Node.js, Express, MongoDB, and JWT authentication — designed to power admin dashboards and client streaming applications.

## Overview

This package includes two React frontend panels, client- and admin-side, and a RESTful backend service for a video streaming platform, as well as a fully automated MongoDB upload routine to process large amounts of data. It provides authentication, role-based authorization, user management, media handling, and analytics; all optimized for real-world admin dashboards and frontend clients. This API is built with clean architecture, security-first principles, and production-ready patterns.

## Core Features

1) Authentication & Authorization
- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control (ADMIN, USER)
- Token verification middleware

2) User Management
- User registration and login
- Admin-only user creation
- Profile updates (including image support)
- Soft activation control (isActive)
- Monthly user statistics (analytics-ready)

3) Media & Lists
- Movie and series support
- Genre tagging and querying
- List creation & updates
- Content validation
- Admin-only modification routes

4) Analytics
- Aggregated user statistics
- Monthly signup tracking
- Backend-ready chart data for dashboards

## Technical Stack

|<div align="center">**Backend**</div>|<div align="center">**Frontend**</div>|<div align="center">**DB**</div>|

1) Tools
|------------|----------|------------|
|   Node.js  |  React	|  MongoDB   |
| Express.js |   Vite   |  Mongoose  |
|    JWT     |          | Firebase |
|   bcrypt   |          |            |

2) Security
- JWT (JSON Web Tokens) with expiry and storage for network connection issues
- bcrypt used for password storage hashing
- Environment-based secrets (dotenv)
- Protected routes and middleware

3) Database
- MongoDB with aggregation pipelines
- Firebase Cloud file storage
- Optimized schema design
- StorageHashing schema
- Fully automated media upload and database ingestion pipeline
- Indexed queries

4) API Design 
- RESTful architecture
- Clean route separation for admin and client
- Middleware-driven validation
- Error-safe responses

5) UI Design
- Fully responsive design from mobile to wide-screen sizes
- Browser-aware dark-light toggle
- User-friendly notifications for upload, creation flow and errors

6) Deployment
- local environment
- Docker

## Getting Started

For backend and frontend
1. Create a .env file 
1.1. in backend root with MONGO_URL for MongoDB connection, TOKEN_KEY for JWT and PORT with port number 
1.2. in frontend root with VITE_API_URL to connect backend which is usually localhost with backend port number 
1.3. in admin root with same VITE_API_URL to connect backend, PORT number and Firebase dependencies (see Firebase documentation)
2. install dependencies for both frontends via `npm install`
3. execute run commands locally (also for testing)
3.1. for backend server via `npm start`
3.2. for frontends via `npm run dev`
4. setup docker
4.1. check docker-compose.yml
4.2. run via `docker-compose up --build`
5. IMPORTANT: first frontend login, always assigns admin role to log into admin panel (alternatively use Postman)

For db generation
1. Create a .env file in db root with MONGO_URL for MongoDB connection
2. Create a firebase-key.json for Firebase Cloud storage connection (check Firebase documentation)
3. Add DB data incl. all thumbnail and feature images, trailers and videos (see Project Structure for folder outline)
4. Generate DB json files in accordance with Mongoose Schema (see Github Repo example upload)
5. Run upload via `npm run import:movies -- ../data/<your_db.json>`

## Services & Ports

| Service | URL |
|-------|-------------------|
| Client | http://localhost:5173 |
| Admin | http://localhost:4000 |
| Backend API | http://localhost:8800 |
| MongoDB (local) | mongodb://localhost:27017 |
| MongoDB (docker) | mongodb://localhost:27017 |

## Project Structure

```
app/
├── admin/
│   ├── public/
│   ├── src/        # frontend components, pages, Firebase connection and assets
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── index.html
│   └── vite.config.js
├── backend/
│   ├── routes/     # backend routes for admin- and client-side
│   ├── models/     # MongoDB schema
│   ├── utils/      # utility functions for storage hashing and token verification
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   └── index.js
├── client/
│   ├── public/
│   ├── src/        # frontend components, pages and assets
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── index.html
│   └── vite.config.js
├── db/
│   ├── config/     # Firebase configuration
│   ├── data/       # streaming data
│   │   ├── img     # feature banner img
│   │   ├── imgSm   # thumbnail img
│   │   ├── trailer # trailer
│   │   ├── video   # videos
│   │   └── db.json # json file with movie entries (see examples in repo for formatting)
│   ├── models/     # MongoDB schema
│   ├── scripts/    # automation script for DB upload
│   ├── .env
│   └── firebase-key.json
├──.gitignore
├── docker-compose.yml
└── README.md
```

## This Project Demonstrates

- Real-world full-stack architecture
- Secure JWT-based authentication flows
- Admin vs client permission boundaries
- MongoDB aggregation pipelines for analytics
- Media handling with cloud storage (Firebase)
- Dockerized multi-service orchestration
- Scalable frontend + backend separation
- Production-grade environment configuration
- Fully responsive UI design

## Why This Project?

This project was built to simulate a production-grade streaming platform,
covering authentication, media handling, analytics, and admin workflows.
It focuses on clean architecture, scalability, and real deployment scenarios.

Originally, it was written to showcase the results of my diffusion models which you see in the demo videos. 
Checkout my repository [ml-imggenerate](https://github.com/ankaba-x00/ml-imggenerate) if you are interested.

## Contact 

Always open for constructive criticism and code roasts, and happy to acknowledge your contribution. For contributions, comments or collaborations, please open an issue or reach out directly.

## License 

This project is open-source under the MIT License.
You may use, modify, and distribute this software freely, subject to the terms stated in the LICENSE file.

## Demo video

