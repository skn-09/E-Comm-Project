"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateTokens = exports.authenticateUser = exports.registerUser = exports.AuthServiceError = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
class AuthServiceError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AuthServiceError = AuthServiceError;
const buildUserResponse = (user) => {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contact: user.contact,
    };
};
const registerUser = async (payload) => {
    const existingUser = await User_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new AuthServiceError("Email already exists", 409);
    }
    const hashedPassword = await (0, auth_1.hashPassword)(payload.password);
    const newUser = new User_1.User({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        contact: payload.contact,
    });
    await newUser.save();
    return buildUserResponse(newUser);
};
exports.registerUser = registerUser;
const authenticateUser = async (email, password) => {
    const user = await User_1.User.findOne({ email });
    if (!user) {
        throw new AuthServiceError("User not found", 404);
    }
    const isPasswordValid = await (0, auth_1.comparePasswords)(password, user.password);
    if (!isPasswordValid) {
        throw new AuthServiceError("Invalid password", 401);
    }
    const payload = { userId: user._id.toString() };
    const accessToken = (0, auth_1.generateAccessToken)(payload);
    const refreshToken = (0, auth_1.generateRefreshToken)(payload);
    user.refreshToken = refreshToken;
    await user.save();
    return {
        user: buildUserResponse(user),
        token: accessToken,
        refreshToken,
    };
};
exports.authenticateUser = authenticateUser;
const rotateTokens = async (refreshToken) => {
    const decodedToken = (0, auth_1.verifyRefreshToken)(refreshToken);
    const user = await User_1.User.findById(decodedToken.userId);
    if (!user || user.refreshToken !== refreshToken) {
        throw new AuthServiceError("Invalid refresh token. Please login again.", 401);
    }
    const payload = { userId: user._id.toString() };
    const newAccessToken = (0, auth_1.generateAccessToken)(payload);
    const newRefreshToken = (0, auth_1.generateRefreshToken)(payload);
    user.refreshToken = newRefreshToken;
    await user.save();
    return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
    };
};
exports.rotateTokens = rotateTokens;
