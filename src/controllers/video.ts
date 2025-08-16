import { Request, Response } from "express";
import { Category, User, Video } from "../models/Models";
import { errorResponse } from "../utils/modules";


export const getVideos = async (req: Request, res: Response) => {
    const { id, } = req.user;

    const { page = 1, limit, category, search, categoryId, orderBy } = req.query;

    try {
        const videos = await Video.findAll({
            where: {},
            include: [{
                model: User,
                attributes: { exclude: ['password'] }
            }, {
                model: Category
            }]
        })
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'Error getting videos');
    }
}