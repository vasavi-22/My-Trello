import { Router } from "express";
import { signUp, login, logout, uploadAvatar } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", uploadAvatar, signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;