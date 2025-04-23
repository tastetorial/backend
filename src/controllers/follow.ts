import { Request, Response } from "express";
import { Follow, User } from "../models/Models";
import { errorResponse, successResponse } from "../utils/modules";

export const follow = async (req: Request, res: Response) => {
    const followerId = req.user.id;

    const { followingId } = req.body;

    if (followerId === followingId) {
        return res.status(400).json({ message: "You can't follow yourself." });
    }

    try {
        const [follow, created] = await Follow.findOrCreate({
            where: { followerId, followingId },
        });

        if (!created) {
            return res.status(409).json({ message: 'Already following.' });
        }

        return res.status(201).json({ message: 'Now following.', data: follow });
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
    const { followerId, followingId } = req.query;

    try {
        const follow = await Follow.findOne({
            where: { followerId, followingId },
        });

        return res.status(200).json({ following: !!follow });
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
}

// Get followers of a user
export const getFollowers = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const followers = await Follow.findAll({
            where: { followingId: userId },
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
    const { userId } = req.params;

    try {
        const following = await Follow.findAll({
            where: { followerId: userId },
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