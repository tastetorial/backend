"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = exports.getCreatorQuerySchema = exports.myVideoQuerySchema = exports.videoQuerySchema = void 0;
const zod_1 = require("zod");
const enum_1 = require("../enum");
exports.videoQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(10),
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z.coerce.number().optional(),
    orderBy: zod_1.z.enum(['createdAt', 'views', 'title', 'likes', 'comments']).optional(),
    orderDir: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.myVideoQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(10),
    status: zod_1.z.enum(enum_1.VideoStatus).optional(),
    orderBy: zod_1.z.enum(['createdAt', 'views', 'title', 'likes', 'comments']).optional(),
    orderDir: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.getCreatorQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(10),
    status: zod_1.z.enum(enum_1.CreatorStatus).optional(),
    search: zod_1.z.string().optional(),
});
exports.pagination = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(10),
});
