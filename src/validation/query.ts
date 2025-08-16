import { z } from 'zod';

export const videoQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    category: z.string().optional(),
    search: z.string().optional(),
    categoryId: z.coerce.number().optional(),
    orderBy: z.enum(['createdAt', 'views', 'title', 'likes', 'comments']).optional(),
    orderDir: z.enum(['asc', 'desc']).default('desc'),
});