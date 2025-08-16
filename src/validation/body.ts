import { email, z } from "zod";
import { OTPReason } from "../enum";

export const registerSchema = z.object({
    email: z
        .email({ message: "Invalid email address" }),
    phone: z
        .string()
        .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number" }),
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
        .string()
}).refine((data: any) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});


export const loginSchema = z.object({
    email: z
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
})


export const verifyOTPSchema = z.object({
    otp: z.string().length(6, { message: "OTP must be 6 characters" }),

    email: z.email({ message: "Invalid email address" }),

    reason: z.enum(OTPReason)
})

export const updateProfileSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters" }).optional(),
    firstname: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" })
        .optional(),
    lastname: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .optional(),
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 characters" })
        .optional(),
    birthday: z
        .date().
        optional()
})


export const changePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(6, { message: "Old password must be at least 6 characters" }),
    newPassword: z
        .string()
        .min(6, { message: "New password must be at least 6 characters" }),
    confirmNewPassword: z
        .string()
        .min(6, { message: "Confirm new password must be at least 6 characters" })
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must be the same",
    path: ["confirmNewPassword"] // set the path of the error
})


export const resetPasswordSchema = z.object({
    email: z.email({ message: "Invalid email address" }),

    newPassword: z
        .string()
        .min(6, { message: "New password must be at least 6 characters" }),
})