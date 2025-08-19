"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentSchema = exports.updateVideoSchema = exports.createVideoSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.verifyOTPSchema = exports.loginSchema = exports.creatorSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const enum_1 = require("../enum");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .email({ message: "Invalid email address" }),
    phone: zod_1.z
        .string()
        .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number" }),
    firstName: zod_1.z
        .string()
        .min(2, { message: "First name must be at least 2 characters" }),
    lastName: zod_1.z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: zod_1.z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
exports.creatorSchema = zod_1.z.object({
    bio: zod_1.z.string().min(10, { message: "Bio must be at least 10 characters" }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});
exports.verifyOTPSchema = zod_1.z.object({
    otp: zod_1.z.string().length(6, { message: "OTP must be 6 characters" }),
    email: zod_1.z.email({ message: "Invalid email address" }),
    reason: zod_1.z.enum(enum_1.OTPReason)
});
exports.updateProfileSchema = zod_1.z.object({
    username: zod_1.z.string().min(2, { message: "Username must be at least 2 characters" }).optional(),
    firstname: zod_1.z
        .string()
        .min(2, { message: "First name must be at least 2 characters" })
        .optional(),
    lastname: zod_1.z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .optional(),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 characters" })
        .optional(),
    birthday: zod_1.z
        .date().
        optional()
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z
        .string()
        .min(6, { message: "Old password must be at least 6 characters" }),
    newPassword: zod_1.z
        .string()
        .min(6, { message: "New password must be at least 6 characters" }),
    confirmNewPassword: zod_1.z
        .string()
        .min(6, { message: "Confirm new password must be at least 6 characters" })
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must be the same",
    path: ["confirmNewPassword"] // set the path of the error
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.email({ message: "Invalid email address" }),
    newPassword: zod_1.z
        .string()
        .min(6, { message: "New password must be at least 6 characters" }),
});
exports.createVideoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(),
    categoryId: zod_1.z.coerce.number('categoryId must be a number'),
    thumbnailUrl: zod_1.z.url('thumbnail must be a valid URL'),
    videoUrl: zod_1.z.url('video must be a valid URL'),
    status: zod_1.z.enum(['published', 'draft']).default('published')
});
exports.updateVideoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(),
    categoryId: zod_1.z.coerce.number('categoryId must be a number').optional(),
    thumbnailUrl: zod_1.z.url('thumbnail must be a valid URL').optional(),
    videoUrl: zod_1.z.url('video must be a valid URL').optional(),
    status: zod_1.z.enum(['published', 'draft']).optional()
});
exports.addCommentSchema = zod_1.z.object({
    videoId: zod_1.z.coerce.number(),
    comment: zod_1.z.string().min(1, 'comment is required'),
});
