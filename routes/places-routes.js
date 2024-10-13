import { Router } from "express";
import { check } from "express-validator";

import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controllers.js";
import { fileUpload } from "../middleware/file-upload.js";
import checkAuth from "../middleware/check-auth.js";

const router = Router(); // create router object

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single('image'),
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
