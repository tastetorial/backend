import { Request, Response } from "express";
import { Reaction } from "../models/Models";

export const createReaction = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const { type, value, postId } = req.body;

    try {
        // If it's a rating, check if the user already rated this post
        if (type === 'rating') {
            const existing = await Reaction.findOne({
                where: { postId, userId, type: 'rating' },
            });

            if (existing) {
                // Update existing rating
                existing.value = value;
                await existing.save();
                return res.status(200).json({ message: 'Rating updated', data: existing });
            }
        }

        // If it's a like, prevent duplicate likes
        if (type === 'like') {
            const existing = await Reaction.findOne({
                where: { postId, userId, type: 'like' },
            });

            if (existing) {
                return res.status(409).json({ message: 'Already liked' });
            }
        }

        const reaction = await Reaction.create({ type, value, postId, userId });

        return res.status(201).json({ message: 'Reaction created', data: reaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}


export const deleteReaction = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const { postId, type } = req.body;

    try {
        const reaction = await Reaction.findOne({
            where: { postId, userId, type },
        });

        if (!reaction) {
            return res.status(404).json({ message: 'Reaction not found' });
        }

        await reaction.destroy();

        return res.status(200).json({ message: 'Reaction removed' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


export const getLikes = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const likes = await Reaction.findAll({
            where: { postId, type: 'like' },
        });

        return res.status(200).json({ likes });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


export const getAverageRating = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const result = await Reaction.findOne({
            attributes: [
                [Reaction.sequelize!.fn('AVG', Reaction.sequelize!.col('value')), 'avgRating'],
            ],
            where: { postId, type: 'rating' },
            raw: true,
        }) as unknown as { avgRating: string | null };

        const average = parseFloat(result?.avgRating || '0');

        return res.status(200).json({ average });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}