# User Notes API

A REST API built to learn backend development concepts including HTTP requests, authentication, databases, and deployment.

---

## Overview

This project allows users to:
- Register and log in
- Create, read, update, and delete notes
- Access only their own notes using authentication

The goal of this project was to understand how backend systems work end-to-end, from handling requests to interacting with a database and deploying to the cloud.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JSON Web Tokens (JWT)
- Docker
- Render (deployment)

---

## Live API

Base URL: https://usernotesapi.onrender.com


---

## How to Use

Use Postman (or any API client) to send HTTP requests to the API.

### Auth Routes

- `POST /auth/register` → Register a new user  
- `POST /auth/login` → Login and receive a token  

---

### Notes Routes (Require Auth)

Include this header: Authorization: Bearer <your_token>


- `GET /notes` → Get all notes  
- `POST /notes` → Create a note  
- `PUT /notes/:id` → Update a note  
- `DELETE /notes/:id` → Delete a note  

---

## What I Learned

- How HTTP requests and REST APIs work
- How to connect a backend to a PostgreSQL database
- How authentication works using JWT
- How to deploy a backend to the cloud
- How Docker containers run backend services

---

## Notes

- The API is deployed on Render and uses a hosted PostgreSQL database
- All protected routes require a valid JWT token

