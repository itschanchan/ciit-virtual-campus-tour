import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// POST /api/admin/register  - create a new account
router.post("/register", AuthController.register);

// POST /api/admin/login     - returns accessToken in JSON + sets refreshToken cookie
router.post("/login", AuthController.login);

// GET /api/admin/session    - returns the admin from the refreshToken cookie
router.get("/session", AuthController.session);

// POST /api/admin/refresh   - browser sends refreshToken cookie, get a new accessToken
router.post("/refresh", AuthController.refresh);

// POST /api/admin/logout    - clears the refreshToken cookie
// ceremonial log out
router.post("/logout", AuthController.logout);

export default router;
