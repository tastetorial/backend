import { Request, Response } from 'express'
import { Creator, Follow, User, Video } from '../models/Models'
import { errorResponse, successResponse, successResponseFalse } from '../utils/modules'
import { Op } from 'sequelize'
import { updateUserSchema } from '../validation/body'
import { UserRole } from '../enum'

export const getUsers = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const user = await User.findAll({
            where: {
                [Op.not]: {
                    id: id
                }
            },
            attributes: { exclude: ['password', 'deviceToken'] },
            include: [{
                model: Creator,
                as: 'creator',
                required: false,
            }]
        })

        return successResponse(res, 'success', user);
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal server error');
    }
}



// export const getUserDetails = async (req: Request, res: Response) => {
//     const { userId } = req.params

//     try {
//         const user = await User.findOne({
//             where: { userId },
//             attributes: { exclude: ['password', 'deviceToken'] },
//             include: [
//                 {
//                     model: User,
//                     attributes: { exclude: ['password'] },
//                 },
//                 {
//                     model: Creator,
//                     as: 'creator',
//                     required: false,
//                 },
//                 {
//                     model: Follow,
//                     as: 'followings',
//                     required: false,
//                     include: [{
//                         model: User,
//                         attributes: ['id', 'firstname', 'lastname', 'username', 'avatar'],
//                     }]
//                 },
//                 {
//                     model: Follow,
//                     as: 'followers',
//                     required: false,
//                     include: [{
//                         model: User,
//                         attributes: ['id', 'firstname', 'lastname', 'username', 'avatar'],
//                     }]
//                 },
//                 {
//                     model: Video,
//                     as: 'videos',
//                 }
//             ]
//         })

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' })
//         }


//         let followers = await Follow.count({
//             where: {
//                 followingId: userId
//             }
//         })

//         let following = await Follow.count({
//             where: {
//                 followerId: userId
//             }
//         })

//         let videos = await Video.count({
//             where: {
//                 userId: userId
//             }
//         })


//         user?.setDataValue('followerCount', followers)
//         user?.setDataValue('followingCount', following)
//         user?.setDataValue('videoCount', videos)


//         return successResponse(res, 'success', user)
//     } catch (error) {
//         console.log(error)
//         return errorResponse(res, 'error', error)
//     }
// }


export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({ message: 'User id is required' })
        }

        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password', 'deviceToken'] },
            include: [
                {
                    model: Creator,
                    required: false
                }]
        })

        if (!user) {
            return errorResponse(res, 'error', 'User not found')
        }

        return successResponse(res, 'success', user)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}

export const editProfile = async (req: Request, res: Response) => {
    const { id, role } = req.user;

    const result = updateUserSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    const { avatar, username, firstname, lastname, email, phone, birthday, bio } = result.data;


    try {
        const updated = await User.update({
            avatar, username, firstname, lastname, email, phone, birthday
        }, {
            where: { id: id }
        })

        if (updated[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (role === UserRole.CREATOR && bio) {
            const updatedCreator = Creator.update({
                bio: bio
            }, {
                where: {
                    userId: id
                }
            })
        }

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Creator,
                attributes: ['bio']
            }]
        })

        return successResponse(res, 'success', user)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;

        const deleted = await User.destroy({
            where: { id: id }
        })

        if (deleted === 0) {
            return res.status(404).json({ message: 'User not found' });
        }


        return successResponse(res, 'success', 'Profile deleted successfully')
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal Server Error')
    }
}

