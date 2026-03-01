"use strict";
// backend/src/dto/user.dto.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChangePassword = exports.validateUpdateProfile = void 0;
/* ============================= */
/* Validation Utilities */
/* ============================= */
const validateUpdateProfile = (data) => {
    if (!data.name || data.name.trim().length < 3) {
        throw new Error("Name must be at least 3 characters");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        throw new Error("Invalid email format");
    }
};
exports.validateUpdateProfile = validateUpdateProfile;
const validateChangePassword = (data) => {
    if (!data.oldPassword) {
        throw new Error("Old password is required");
    }
    if (!data.newPassword || data.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
    }
    if (data.oldPassword === data.newPassword) {
        throw new Error("New password must be different from old password");
    }
};
exports.validateChangePassword = validateChangePassword;
