import express from "express";
import mongoose from "mongoose";
import { config } from "./src/config/index.js";

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('hello world');
});

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