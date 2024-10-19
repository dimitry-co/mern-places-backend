import { Router } from "express";
import { check } from "express-validator";

import { getUsers, signup, login } from "../controllers/users-controllers.js";
import { fileUpload } from "../middleware/file-upload.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single('image'),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided!" });
    }
    try {
      // Upload image to S3
      const imageUrl = await uploadToS3(req.file);
      req.body.image = imageUrl; // Attach image URL to the request body
      next(); // Continue to the signup controller
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

export default router;