import { Router } from "express";
import { signUp, login, logout } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;