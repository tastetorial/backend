import { Request, Response } from 'express'
import { Follow, Profile, User } from '../models/Models'
import { errorResponse, successResponse, successResponseFalse } from '../utils/modules'
import { Op } from 'sequelize'

export const getProfiles = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const profiles = await Profile.findAll({
            where: {
                [Op.not]: {
                    userId: id
                }
            }
        })

        return successResponse(res, 'success', profiles);
    } catch (error) {
        return errorResponse(res, 'error', error);
    }
}



export const getProfile = async (req: Request, res: Response) => {
    const { userId } = req.params

    try {
        const profile = await Profile.findOne({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: { exclude: ['password'] },
                }
            ]
        })

        let followers = await Follow.count({
            where: {
                followingId: userId
            }
        })

        let following = await Follow.count({
            where: {
                followerId: userId
            }
        })

        profile?.setDataValue('followers', followers)
        profile?.setDataValue('following', following)

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        return successResponse(res, 'success', profile)
    } catch (error) {
        return errorResponse(res, 'error', error)
    }
}
