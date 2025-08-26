import { Request, Response } from "express";
import { SavedVideo } from "../models/SavedVideo";
import { User, Video } from "../models/Models";
import sequelize from "../config/db";
import { errorResponse, handleResponse, successResponse } from "../utils/modules";
import { pagination } from "../validation/query";

export const getMySavedVideos = async (req: Request, res: Response) => {
    const { id } = req.user;

    const result = pagination.safeParse(req.query);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    const { page, limit } = result.data;

    try {
        const videos = await SavedVideo.findAll({
            where: {
                userId: id
            },
            include: [{
                model: Video,
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
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'avatar']
                }]
            }],

            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        })

        return successResponse(res, 'success', videos);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Error while getting saved videos');
    }
}

export const toggleSaveVideo = async (req: Request, res: Response) => {
    const { videoId } = req.params;

    try {
        const savedVideo = await SavedVideo.findOne({
            where: {
                userId: req.user.id,
                videoId
            }
        })

        if (savedVideo) {
            await savedVideo.destroy();
            return successResponse(res, 'success', { saved: false, message: 'Removed from saved videos' });
        }

        const saved = SavedVideo.create({
            userId: req.user.id,
            videoId
        })

        return successResponse(res, 'success', { saved: true, message: 'Video saved' });
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Error while saving video');
    }
}

export const isSavedVideo = async (req: Request, res: Response) => {
    const { videoId } = req.params;

    try {
        const savedVideo = await SavedVideo.findOne({
            where: {
                userId: req.user.id,
                videoId
            }
        })

        if (savedVideo) {
            return successResponse(res, 'success', { saved: true });
        }

        return successResponse(res, 'success', { saved: false });
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Error while checking saved video');
    }
}

