import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./src/config/index.js";

import userRoutes from "./src/routes/user.route.js";
import taskRoutes from "./src/routes/task.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend's origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(session({
    secret: 'mySuperSecretKey123456!',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in production with HTTPS
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use("/user", userRoutes);
app.use("/tasks", taskRoutes);

( async () => {
    try {
        await mongoose.connect(config.DATABASE);
        console.log("MongoDB connected");
  
        app.listen(process.env.PORT, () => {
            console.log(`Server starts at port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
})()