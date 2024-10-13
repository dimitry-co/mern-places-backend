import * as fs from "fs";
import path from "path";

import express from "express";
import mongoose from "mongoose";


import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

const app = express(); // create express app

app.use(express.json()); // parse any incoming requests body of content-type - application/json

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  //res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  //res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this line

  next();
});

app.use("/api/places", placesRoutes); // register placesRoutes as middleware
app.use("/api/users", usersRoutes); // register usersRoutes as middleware

app.use((req, res, next) => {
  // middleware function to handle unsupported routes
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  // error handling middleware function - 4 parameters - express knows this is an error handling middleware function because it has 4 parameters
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) { // check if response has already been sent
    return next(error); // forward error to next middleware function
  }
  res.status(error.code || 500); // set status code to error code or 500
  res.json({ message: error.message || "An unknown error occurred!" }); // set response body to error message or 'An unknown error occurred!'
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8g1byrv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5001);
  })
  .catch((error) => {
    console.log(error);
  });