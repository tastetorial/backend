import { Request, Response } from "express";
import { Follow, User } from "../models/Models";
import { errorResponse, successResponse } from "../utils/modules";

export const toggleFollow = async (req: Request, res: Response) => {
    const followerId = req.user.id;

    const { followingId } = req.params;

    if (followerId === followingId) {
        return res.status(400).json({ message: "You can't follow yourself." });
    }

    try {
        const [follow, created] = await Follow.findOrCreate({
            where: { followerId, followingId },
        });

        if (!created) {
            await follow.destroy();
            return successResponse(res, 'success', { following: false, message: 'Already following. Unfollowed now.' });
        }

        return successResponse(res, 'success', { following: true, message: 'Now following.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
}

// Unfollow a user
export const unfollow = async (req: Request, res: Response) => {
    const followerId = req.user.id;

    const { followingId } = req.body;

    try {
        const follow = await Follow.findOne({
            where: { followerId, followingId },
        });

        if (!follow) {
            return res.status(404).json({ message: 'Not following.' });
        }

        await follow.destroy();
        return res.status(200).json({ message: 'Unfollowed successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
}

// Check if a user is following another
export const isFollowing = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { followingId } = req.params;

    try {
        const follow = await Follow.findOne({
            where: { followerId: id, followingId },
        });

        return successResponse(res, 'success', { following: Boolean(follow) });
    } catch (err) {
        return errorResponse(res, 'error', 'Internal server error');
    }
}

// Get followers of a user
export const getFollowers = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const followers = await Follow.findAll({
            where: { followingId: id },
            include: [{
                model: User,
                as: 'follower',
                attributes: { exclude: ['password'] },
            }],
        });

        return successResponse(res, 'success', followers);
    } catch (err) {
        return errorResponse(res, 'error', err);
    }
}

// Get who a user is following
export const getFollowing = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const following = await Follow.findAll({
            where: { followerId: id },
            include: [{
                model: User,
                as: 'following',
                attributes: { exclude: ['password'] },
            }],
        });

        return successResponse(res, 'success', following);
    } catch (err) {
        return errorResponse(res, 'error', err);
    }
}