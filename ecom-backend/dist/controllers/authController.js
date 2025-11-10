"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAuthToken = exports.loginUser = exports.signupUser = void 0;
const validators_1 = require("../utils/validators");
const authService_1 = require("../services/authService");
const signupUser = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;
        if (!name || !email || !password || !contact) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!(0, validators_1.validatePassword)(password)) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
        }
        if (!(0, validators_1.validateContact)(contact)) {
            return res
                .status(400)
                .json({ message: "Contact must be a 10-digit number" });
        }
        await (0, authService_1.registerUser)({ name, email, password, contact });
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        if (error instanceof authService_1.AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("signupUser error", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.signupUser = signupUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Both email and password are required" });
        }
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const { token, refreshToken, user } = await (0, authService_1.authenticateUser)(email, password);
        return res.status(200).json({
            message: "Login successful",
            token,
            refreshToken,
            user,
        });
    }
    catch (error) {
        if (error instanceof authService_1.AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("loginUser error", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.loginUser = loginUser;
const refreshAuthToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        const tokens = await (0, authService_1.rotateTokens)(refreshToken);
        return res.status(200).json({
            message: "Token refreshed successfully",
            ...tokens,
        });
    }
    catch (error) {
        if (error instanceof authService_1.AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("refreshAuthToken error", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.refreshAuthToken = refreshAuthToken;
