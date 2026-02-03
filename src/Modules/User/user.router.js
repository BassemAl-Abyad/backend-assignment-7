import { Router } from "express";
import * as userController from "./user.controller.js";

const router = Router();

// 1. Signup: POST /users/signup
router.post("/signup", userController.signup);

// 2. Upsert: PUT /users/:id (Requirement: create or update based on PK)
router.put("/:id", userController.upsertUser);

// 3. Search by Email: GET /users/by-email?email=...
router.get("/by-email", userController.getByEmail);

export default router;