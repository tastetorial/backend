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
exports.getProfile = exports.getProfiles = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const sequelize_1 = require("sequelize");
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const profiles = yield Models_1.Profile.findAll({
            where: {
                [sequelize_1.Op.not]: {
                    userId: id
                }
            }
        });
        return (0, modules_1.successResponse)(res, 'success', profiles);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.getProfiles = getProfiles;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const profile = yield Models_1.Profile.findOne({
            where: { userId },
            include: [
                {
                    model: Models_1.User,
                    attributes: { exclude: ['password'] },
                }
            ]
        });
        let followers = yield Models_1.Follow.count({
            where: {
                followingId: userId
            }
        });
        let following = yield Models_1.Follow.count({
            where: {
                followerId: userId
            }
        });
        profile === null || profile === void 0 ? void 0 : profile.setDataValue('followers', followers);
        profile === null || profile === void 0 ? void 0 : profile.setDataValue('following', following);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        return (0, modules_1.successResponse)(res, 'success', profile);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.getProfile = getProfile;
