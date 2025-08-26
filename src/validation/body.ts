import { email, z } from "zod";
import { OTPReason } from "../enum";

export const registerSchema = z.object({
    email: z
        .email({ message: "Invalid email address" }),
    phone: z
        .string()
        .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number" }),
    firstname: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" }),
    lastname: z
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

export const creatorSchema = z.object({
    bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
})


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


export const createVideoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    tags: z.string().optional(),
    categoryId: z.coerce.number('categoryId must be a number'),
    thumbnailUrl: z.url('thumbnail must be a valid URL'),
    videoUrl: z.url('video must be a valid URL'),
    status: z.enum(['published', 'draft']).default('published')
});


export const updateVideoSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    tags: z.string().optional(),
    categoryId: z.coerce.number('categoryId must be a number').optional(),
    thumbnailUrl: z.url('thumbnail must be a valid URL').optional(),
    videoUrl: z.url('video must be a valid URL').optional(),
    status: z.enum(['published', 'draft']).optional()
})


export const addCommentSchema = z.object({
    videoId: z.coerce.number(),
    comment: z.string().min(1, 'comment is required'),
});

export const addCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    image: z.url("Image must be a valid URL").nullable().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().nullable().optional(),
    image: z.url("Image must be a valid URL").nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
    path: []
});

export const updateUserSchema = z.object({
    email: z
        .email("Invalid email address")
        .max(50, "Email must be at most 50 characters")
        .optional(),

    phone: z
        .string()
        .min(7, "Phone must be at least 7 digits")
        .max(20, "Phone must be at most 20 characters")
        .optional(),

    username: z
        .string()
        .max(20, "Username must be at most 20 characters")
        .optional(),

    firstname: z
        .string()
        .max(100, "Firstname must be at most 100 characters")
        .optional(),

    lastname: z
        .string()
        .max(100, "Lastname must be at most 100 characters")
        .optional(),

    avatar: z
        .url("Avatar must be a valid URL")
        .optional(),

    birthday: z
        .string()
        .refine(
            (val) => !isNaN(Date.parse(val)),
            { message: "Birthday must be a valid date (YYYY-MM-DD)" }
        )
        .optional(),

    bio: z.string().optional()
});




