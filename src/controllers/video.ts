import { Request, Response } from "express";
import { Category, Reaction, User, Video } from "../models/Models";
import { errorResponse, successResponse } from "../utils/modules";
import { Op, Sequelize } from "sequelize";
import { VideoStatus } from "../enum";
import { videoQuerySchema } from "../validation/query";
import sequelize from "../config/db";


export const getVideos = async (req: Request, res: Response) => {
    const { id, } = req.user;

    const result = videoQuerySchema.safeParse(req.query);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }


    const { page = 1, limit = 10, category, search, categoryId, orderBy, orderDir } = result.data


    try {
        const videos = await Video.findAll({
            where: {
                ...(categoryId && { categoryId }),
                ...(search && {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } }
                    ]
                }),
                status: VideoStatus.PUBLISHED
            },
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                      SELECT SUM(CAST([like] AS INT))
                      FROM reactions
                      WHERE reactions.videoId = Video.id
                    )`),
                        'likes'
                    ],
                    [
                        sequelize.literal(`(
                      SELECT COUNT([comment])
                      FROM reactions
                      WHERE reactions.videoId = Video.id
                    )`),
                        'comments'
                    ]
                ]
            },
            limit: limit,
            offset: (page - 1) * limit,
            include: [{
                model: User,
                as: 'creator',
                attributes: { exclude: ['password'] },

            }, {
                model: Category,
                where: {
                    ...(category && { name: { [Op.like]: `%${category}%` } })
                }
            }],
            order: [
                ...(orderBy === 'likes' ?
                    [[sequelize.literal('likes'), (orderDir || 'DESC').toUpperCase() as 'ASC' | 'DESC'] as any]
                    : []
                ),
                ...(orderBy === 'comments' ?
                    [[sequelize.literal('comments'), (orderDir || 'DESC').toUpperCase() as 'ASC' | 'DESC'] as any]
                    : []
                ),
                ...(orderBy !== 'likes' && orderBy !== 'comments'
                    ? [[orderBy || 'createdAt', (orderDir || 'DESC').toUpperCase() as 'ASC' | 'DESC'] as any]
                    : []
                )
            ]
        })


        return successResponse(res, 'success', videos);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'Error getting videos');
    }
}