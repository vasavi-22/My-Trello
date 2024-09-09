import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Get the directory name from the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where the files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Middleware for handling file uploads
export const uploadAvatar = upload.single('avatar');


export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const avatar = req.file ? `https://my-trello-api.vercel.app/uploads/${path.basename(req.file.path)}` : ''; // Full URL to the image

  console.log(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log("trying to create user....................");
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar,
    });
    await user.save();
    res.status(201).send("User created");
  } catch (error) {
    res.status(400).send("Error creating user");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    console.log("log");
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const session = new Session({ userId: user._id, token });
    await session.save();

    res.json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

export const logout = async (req, res) => {
  const { token } = req.body; // Assuming the token is sent in the request body

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Find and delete the session by token
    console.log(token);
    const session = await Session.findOneAndDelete({ token });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Successfully logged out
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
