import { Request, Response } from "express";
import { Reaction } from "../models/Reaction";
import { errorResponse, successResponse } from "../utils/modules";
import { addCommentSchema } from "../validation/body";
import { Op } from "sequelize";
import { User } from "../models/User";

export const toogleLike = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { videoId } = req.params;

    try {
        const [reaction, created] = await Reaction.findOrCreate({
            where: {
                videoId,
                userId: id
            }, defaults: {
                like: true
            }
        })

        if (!created) {
            reaction.like = !reaction.like;
            if (!reaction.like && !reaction.comment) {
                await reaction.destroy();
            } else {
                await reaction.save();
            }
        }

        return successResponse(res, 'success', reaction);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Something went wrong');
    }
}

export const isLiked = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { videoId } = req.params;

    try {
        const reaction = await Reaction.findOne({
            where: {
                videoId,
                userId: id,
                like: true
            }
        })

        return successResponse(res, 'success', { liked: reaction ? true : false });
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Something went wrong');
    }
}

export const getComments = async (req: Request, res: Response) => {
    const { videoId } = req.params;

    try {
        const comments = await Reaction.findAll({
            where: {
                videoId,
                comment: {
                    [Op.ne]: null
                }
            },
            attributes: ['comment', 'createdAt'],
            include: [{
                model: User,
                attributes: ['id', 'username', 'firstname', 'lastname', 'avatar']
            }]
        })

        return successResponse(res, 'success', comments);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Something went wrong');
    }
}

export const addComment = async (req: Request, res: Response) => {
    const { id } = req.user;

    const result = addCommentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            status: false,
            message: 'validation error',
            errors: result.error.format()
        })
    }

    const { videoId, comment } = result.data;

    try {
        const [reaction, created] = await Reaction.findOrCreate({
            where: {
                videoId,
                userId: id
            }, defaults: {
                comment
            }
        })

        if (!created) {
            reaction.comment = comment;
            await reaction.save();
        }

        return successResponse(res, 'success', reaction);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Something went wrong');
    }
}

export const editComment = async (req: Request, res: Response) => {
    const { id } = req.user;

    const result = addCommentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            status: false,
            message: 'validation error',
            errors: result.error.format()
        })
    }

    const { videoId, comment } = result.data;

    try {
        const reaction = await Reaction.findOne({
            where: {
                videoId,
                userId: id
            }
        })

        if (!reaction) {
            return errorResponse(res, 'error', 'Reaction not found');
        }

        reaction.comment = comment;
        await reaction.save();

        return successResponse(res, 'success', reaction);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Something went wrong');
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { videoId } = req.params;

    try {
        const reaction = await Reaction.findOne({
            where: {
                videoId,
                userId: id
            }
        })

        if (!reaction) {
            return errorResponse(res, 'error', 'Reaction not found');
        }

        if (reaction.like) {
            reaction.comment = null;
            await reaction.save();
        } else {
            await reaction.destroy();
        }

        return successResponse(res, 'success', 'Comment deleted');
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'error', 'Something went wrong');
    }
}