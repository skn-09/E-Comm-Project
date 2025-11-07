"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const validators_js_1 = require("../utils/validators.js");
const signup = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;
        if (!name || !email || !password || !contact) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!(0, validators_js_1.validateEmail)(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!(0, validators_js_1.validatePassword)(password)) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
        }
        if (!(0, validators_js_1.validateContact)(contact)) {
            return res
                .status(400)
                .json({ message: "Contact must be a 10-digit number" });
        }
        const existingUser = await User_js_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new User_js_1.User({
            name,
            email,
            password: hashedPassword,
            contact,
        });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Both email and password are required" });
        }
        if (!(0, validators_js_1.validateEmail)(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User_js_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res
                .status(500)
                .json({ message: "Server configuration error. Please try later." });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, secret, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                contact: user.contact,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
