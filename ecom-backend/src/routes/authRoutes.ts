import express from "express";
import {
  signupUser,
  loginUser,
  refreshAuthToken,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAuthToken);

export default router;
