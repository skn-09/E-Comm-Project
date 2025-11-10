"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContact = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    // At least 6 characters
    return password.length >= 6;
};
exports.validatePassword = validatePassword;
const validateContact = (contact) => {
    // Must be 10-digit number
    return /^[0-9]{10}$/.test(contact);
};
exports.validateContact = validateContact;
