# SlotSwapper

A web application that allows users to create events, view their schedule, and swap event slots with other users.
It helps people manage time efficiently by coordinating and exchanging available slots seamlessly.

# how to run 
##1.Clone the Repository
git clone https://github.com/srushtii04/slotswapper.git
cd slotswapper

## 2.Setup Backend
```bash
cd backend
npm install

## 3.Create a .env file inside backend/ with the following:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key 

## 4.Run the backend:
node server.js

## 5.Setup Frontend
cd ../frontend
npm install
npm run dev

# Tech Stack
Frontend - React, Axios, Tailwind CSS
Backend - Node.js, Express.js
Database - MongoDB with Mongoose
Communication - RESTful APIs
