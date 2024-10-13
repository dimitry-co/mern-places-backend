import jwt from "jsonwebtoken";

import HttpError from "../models/http-error.js";

const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next(); 
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer Token'
        if (!token) {
            throw new Error('Authentication failed'); // throw error if token is missing
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError("Authentication failed", 403);
        return next(error);
    }

};

export default checkAuth;