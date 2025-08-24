import { z } from 'zod';
import { CreatorStatus, VideoStatus } from '../enum';

export const videoQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    search: z.string().optional(),
    categoryId: z.coerce.number().optional(),
    orderBy: z.enum(['createdAt', 'views', 'title', 'likes', 'comments']).optional(),
    orderDir: z.enum(['asc', 'desc']).default('desc'),
});

export const myVideoQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    status: z.enum(VideoStatus).optional(),
    orderBy: z.enum(['createdAt', 'views', 'title', 'likes', 'comments']).optional(),
    orderDir: z.enum(['asc', 'desc']).default('desc'),
});


export const getCreatorQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    status: z.enum(CreatorStatus).optional(),
    search: z.string().optional(),
});

export const pagination = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
})
