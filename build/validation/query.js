"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoQuerySchema = void 0;
const zod_1 = require("zod");
exports.videoQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(10),
    category: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z.coerce.number().optional(),
    orderBy: zod_1.z.enum(['createdAt', 'views', 'title', 'likes', 'comments']).optional(),
    orderDir: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
