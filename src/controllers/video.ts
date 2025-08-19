import { Request, Response } from "express";
import { Category, Reaction, User, Video, VideoView } from "../models/Models";
import { errorResponse, handleResponse, successResponse } from "../utils/modules";
import { Op, Sequelize } from "sequelize";
import { VideoStatus } from "../enum";
import { myVideoQuerySchema, videoQuerySchema } from "../validation/query";
import sequelize from "../config/db";
import { createVideoSchema, updateVideoSchema } from "../validation/body";


export const getVideos = async (req: Request, res: Response) => {
    const { id, } = req.user;

    const result = videoQuerySchema.safeParse(req.query);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }


    const { page = 1, limit = 10, search, categoryId, orderBy, orderDir } = result.data


    try {
        const videos = await Video.findAll({
            where: {
                ...(categoryId && { categoryId }),
                ...(search && {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } },
                        { tags: { [Op.like]: `%${search}%` } }
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


export const getMyVideos = async (req: Request, res: Response) => {
    const { id } = req.user;

    const result = myVideoQuerySchema.safeParse(req.query);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    const { status, page, limit, orderBy, orderDir } = result.data
    try {
        const videos = await Video.findAll({
            where: {
                userId: id,
                ...(status && { status })
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
                model: Category,
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
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}


export const getVideo = async (req: Request, res: Response) => {
    const { videoId } = req.params;

    try {
        const video = await Video.findOne({
            where: { id: videoId },
            include: [{
                model: Category,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            }, {
                model: User,
                attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'avatar']
            }, {
                model: Reaction,
                where: { [Op.not]: { comment: null } },
                attributes: ['id', 'comment', 'userId'],
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'avatar']
                }]
            }]
        })

        return successResponse(res, 'success', video);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}


export const createVideo = async (req: Request, res: Response) => {
    const { id, role } = req.user


    const validation = createVideoSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.flatten() });
    }

    const { title, description, tags, categoryId, thumbnailUrl, videoUrl, status } = validation.data;

    try {
        const video = await Video.create({
            title,
            description,
            tags,
            videoUrl,
            thumbnailUrl,
            status,
            categoryId,
            userId: id
        })

        return successResponse(res, 'success', video);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}


export const updateVideo = async (req: Request, res: Response) => {
    const { id, role } = req.user;

    const { videoId } = req.params;

    if (!videoId) {
        return errorResponse(res, 'error', 'Video Id is required');
    }

    if (isNaN(parseInt(videoId))) {
        return errorResponse(res, 'error', 'Invalid Video Id');
    }

    const validation = updateVideoSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.flatten() });
    }


    try {
        const updated = await Video.update(
            validation.data,
            {
                where: {
                    id: videoId,
                    userId: id
                }
            }
        );

        if (updated[0] === 0) {
            return errorResponse(res, 'error', 'Video not found')
        }

        return successResponse(res, 'success', updated);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}


export const viewVideo = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { videoId } = req.params;

    if (!videoId) {
        return errorResponse(res, 'error', 'Video Id is required');
    }

    if (isNaN(parseInt(videoId))) {
        return errorResponse(res, 'error', 'Invalid Video Id');
    }

    try {
        const video = await Video.findByPk(videoId);

        if (!video) {
            return handleResponse(res, 404, false, 'Video not found')
        }
        const alreadyViewed = await VideoView.findOne({ where: { userId: id, videoId } });

        if (alreadyViewed) {
            return successResponse(res, 'success', 'Video already viewed');
        }

        await VideoView.create({
            userId: id,
            videoId,
            viewedAt: new Date()
        });

        await Video.increment('views', { by: 1, where: { id: videoId } });

        return successResponse(res, 'success', 'Video viewed');
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}


export const archiveVideo = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { videoId } = req.params;

    if (!videoId) {
        return errorResponse(res, 'error', 'Video Id is required');
    }

    if (isNaN(parseInt(videoId))) {
        return errorResponse(res, 'error', 'Invalid Video Id');
    }

    try {
        const updated = await Video.update({
            status: VideoStatus.ARCHIVED
        }, {
            where: {
                id: videoId,
                userId: id
            }
        });

        if (updated[0] === 0) {
            return errorResponse(res, 'error', 'Video not found');
        }

        return successResponse(res, 'success', 'Video archived');
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}


export const publishVideo = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { videoId } = req.params;

    if (!videoId) {
        return errorResponse(res, 'error', 'Video Id is required');
    }

    if (isNaN(parseInt(videoId))) {
        return errorResponse(res, 'error', 'Invalid Video Id');
    }

    try {
        const updated = await Video.update({
            status: VideoStatus.PUBLISHED
        }, {
            where: {
                id: videoId,
                userId: id
            }
        });

        if (updated[0] === 0) {
            return errorResponse(res, 'error', 'Video not found');
        }

        return successResponse(res, 'success', 'Video published');
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}