import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

import HttpError from "../models/http-error.js";
import { getCoordsForAddress } from "../util/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";
import user from "../models/user.js";

// controller functions for routes in routes/places-routes.js. Deals with the callback logic for each route(middleqare function).
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // {pid: 'p1'} => p1 is the value of the pid key in the params object

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    ); // throw error to trigger error handling middleware function
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // {place} => {place: place}
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404) // return next(error) will forward the error to the next middleware function
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req); // check if there are any validation errors
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address } = req.body; // destructure req.body object

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address); // get coordinates from address
  } catch (error) {
    return next(error); // forward error to next middleware function
  }

  const createPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path, // we just store the path of the image file (not the file itself, bc will slow it down and cause bloating)
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500 // 500 -> internal server error
    );
    return next(error);
  }

  res.status(201).json({ place: createPlace }); // set status code to 201 and set response body to createPlace object
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this place",
      401
    );
    return next(error);
  }

  place.title = title; // update title property of updatedPlace object
  place.description = description; // update description property of updatedPlace object

  try {
    await place.save(); // save updatedPlace object to database
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) }); // set status code to 200 and set response body to updatedPlace object
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("something went wrong, could not delete place.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Could not find place for this id.", 404));
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place",
      401
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ seesion: sess }); // Delete the place document
    place.creator.places.pull(place); // Remove the Place reference from the creator
    await place.creator.save({ session: sess }); // Save the updated creator document
    await sess.commitTransaction(); // Commit the transaction
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place.", 500)
    );
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place." });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};

