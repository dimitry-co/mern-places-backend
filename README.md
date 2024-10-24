# Your Places - MERN Backend

This is the backend of the **Your Places** social media application, designed to allow users to share their travel experiences. Built using the MERN stack, this backend handles user authentication, image uploads, and data management for places and users. It integrates with AWS S3 for persistent image storage and MongoDB for storing user data and place details.

## Features

- **User Authentication**:
  - Register, log in, and manage user profiles securely using JWT-based authentication.
  
- **CRUD Operations for Places**:
  - Users can create, read, update, and delete places they have visited, including uploading images.

- **Google Maps API Integration**:
  - Supports geolocation through the Google Maps API, converting addresses to coordinates.

- **AWS S3 Image Storage**:
  - Images are uploaded to AWS S3 for secure, persistent storage.

- **Data Storage**:
  - MongoDB is used to store user profiles and place information.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building API routes.
- **MongoDB**: Database for storing user and place data.
- **Mongoose**: ODM for modeling MongoDB data.
- **AWS SDK (v3)**: Integration with AWS S3 for file storage.
- **Multer**: Middleware for handling file uploads.
- **JWT**: For secure user authentication.

## Getting Started

To set up the backend locally, follow these steps:

### Prerequisites

- **Node.js** and **npm**: Install from [here](https://nodejs.org/).
- **MongoDB**: Set up a local MongoDB instance or use a service like [MongoDB Atlas](https://www.mongodb.com/atlas).

### Installation

1. **Clone the repository**:

    ```bash
    git clone git@github.com:dimitry-co/Your-Places-mern-backend.git
    cd Your-Places-mern-backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory and add the following variables:
    ```
    DB_USER=your-db-username
    DB_PASSWORD=your-db-password
    DB_NAME=your-db-name
    JWT_KEY=your-jwt-secret
    GOOGLE_API_KEY=your-google-api-key
    AWS_ACCESS_KEY_ID=your-aws-access-key
    AWS_SECRET_ACCESS_KEY=your-aws-secret-key
    AWS_REGION=your-aws-region
    S3_BUCKET_NAME=your-s3-bucket-name
    ```
    Replace the placeholders with your actual credentials.

4. **Start the server**:

    ```bash
    npm start
    ```
    The backend will run on `http://localhost:5001`.

## API Endpoints

### User Routes
- **POST** `/api/users/signup`: Register a new user.
- **POST** `/api/users/login`: Log in an existing user.

### Places Routes
- **POST** `/api/places`: Create a new place.
- **GET** `/api/places/user/:userId`: Retrieve all places by a specific user.
- **PATCH** `/api/places/:placeId`: Update a place.
- **DELETE** `/api/places/:placeId`: Delete a place.

## Deployment

To deploy this backend, follow these steps:

1. **Set environment variables** on your deployment platform (e.g., Render, AWS EC2).
2. **Ensure MongoDB connectivity** by using a service like MongoDB Atlas.
3. **Handle CORS settings** to allow requests from your frontend.

## Live API

The live backend API is deployed on Render: [Your Places Backend](https://mern-places-backend-l5l9.onrender.com)