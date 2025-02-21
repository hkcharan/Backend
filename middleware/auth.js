import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "User not authenticated. Token is missing." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Find the user based on the decoded token ID
        req.user = await User.findById(decoded.id);

        // If user does not exist, return error
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        
        // Check if the error is related to invalid or expired token
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please authenticate again." });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired. Please log in again." });
        }

        // Generic server error for any other issues
        res.status(500).json({ message: "Server error during authentication." });
    }
};


