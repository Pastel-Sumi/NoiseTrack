import { Router } from "express";
import { save } from "../controllers/decibel.js";

const router = Router();

router.post("/", save);

export default router;