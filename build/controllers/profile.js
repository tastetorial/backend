"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.editProfile = exports.getUserProfile = exports.getUsers = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const sequelize_1 = require("sequelize");
const body_1 = require("../validation/body");
const enum_1 = require("../enum");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const user = yield Models_1.User.findAll({
            where: {
                [sequelize_1.Op.not]: {
                    id: id
                }
            },
            attributes: { exclude: ['password', 'deviceToken'] },
            include: [{
                    model: Models_1.Creator,
                    as: 'creator',
                    required: false,
                }]
        });
        return (0, modules_1.successResponse)(res, 'success', user);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.getUsers = getUsers;
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
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User id is required' });
        }
        const user = yield Models_1.User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password', 'deviceToken'] },
            include: [
                {
                    model: Models_1.Creator,
                    required: false
                }
            ]
        });
        if (!user) {
            return (0, modules_1.errorResponse)(res, 'error', 'User not found');
        }
        return (0, modules_1.successResponse)(res, 'success', user);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.getUserProfile = getUserProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.user;
    const result = body_1.updateUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { avatar, username, firstname, lastname, email, phone, birthday, bio } = result.data;
    try {
        const updated = yield Models_1.User.update({
            avatar, username, firstname, lastname, email, phone, birthday
        }, {
            where: { id: id }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'No update was made' });
        }
        if (role === enum_1.UserRole.CREATOR && bio) {
            const updatedCreator = yield Models_1.Creator.update({
                bio: bio
            }, {
                where: {
                    userId: id
                }
            });
        }
        const user = yield Models_1.User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [{
                    model: Models_1.Creator,
                    attributes: ['bio']
                }]
        });
        return (0, modules_1.successResponse)(res, 'success', user);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.editProfile = editProfile;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const deleted = yield Models_1.User.destroy({
            where: { id: id }
        });
        if (deleted === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return (0, modules_1.successResponse)(res, 'success', 'Profile deleted successfully');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.deleteProfile = deleteProfile;
