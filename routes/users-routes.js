import { Router } from "express";
import { check } from "express-validator";

import { getUsers, signup, login } from "../controllers/users-controllers.js";
import { fileUpload } from "../middleware/file-upload.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

export default router;