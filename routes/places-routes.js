import { Router } from "express";
import { check } from "express-validator";

import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controllers.js";
import { fileUpload, uploadToS3 } from "../middleware/file-upload.js";
import checkAuth from "../middleware/check-auth.js";

const router = Router(); // create router object

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single('image'),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided!" });
    }
    try {
      // Upload image to S3
      const imageUrl = await uploadToS3(req.file);
      req.body.image = imageUrl; // Attach image URL to the request body
      next(); // Continue to the createPlace controller
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty()
  ],
  createPlace
);

router.patch(
  "/:pid",
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 })
  ],
  updatePlace
);

router.delete("/:pid", deletePlace);

export default router; // export the router object
