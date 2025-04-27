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
exports.getFollowing = exports.getFollowers = exports.isFollowing = exports.unfollow = exports.follow = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const followerId = req.user.id;
    const { followingId } = req.body;
    if (followerId === followingId) {
        return res.status(400).json({ message: "You can't follow yourself." });
    }
    try {
        const [follow, created] = yield Models_1.Follow.findOrCreate({
            where: { followerId, followingId },
        });
        if (!created) {
            return res.status(409).json({ message: 'Already following.' });
        }
        return res.status(201).json({ message: 'Now following.', data: follow });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
});
exports.follow = follow;
// Unfollow a user
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const followerId = req.user.id;
    const { followingId } = req.body;
    try {
        const follow = yield Models_1.Follow.findOne({
            where: { followerId, followingId },
        });
        if (!follow) {
            return res.status(404).json({ message: 'Not following.' });
        }
        yield follow.destroy();
        return res.status(200).json({ message: 'Unfollowed successfully.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
});
exports.unfollow = unfollow;
// Check if a user is following another
const isFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { followerId, followingId } = req.query;
    try {
        const follow = yield Models_1.Follow.findOne({
            where: { followerId, followingId },
        });
        return res.status(200).json({ following: !!follow });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
});
exports.isFollowing = isFollowing;
// Get followers of a user
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const followers = yield Models_1.Follow.findAll({
            where: { followingId: userId },
            include: [{
                    model: Models_1.User,
                    as: 'follower',
                    attributes: { exclude: ['password'] },
                }],
        });
        return (0, modules_1.successResponse)(res, 'success', followers);
    }
    catch (err) {
        return (0, modules_1.errorResponse)(res, 'error', err);
    }
});
exports.getFollowers = getFollowers;
// Get who a user is following
const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const following = yield Models_1.Follow.findAll({
            where: { followerId: userId },
            include: [{
                    model: Models_1.User,
                    as: 'following',
                    attributes: { exclude: ['password'] },
                }],
        });
        return (0, modules_1.successResponse)(res, 'success', following);
    }
    catch (err) {
        return (0, modules_1.errorResponse)(res, 'error', err);
    }
});
exports.getFollowing = getFollowing;
