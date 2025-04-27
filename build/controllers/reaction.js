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
exports.getAverageRating = exports.getLikes = exports.deleteReaction = exports.createReaction = void 0;
const Models_1 = require("../models/Models");
const createReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { type, value, postId } = req.body;
    try {
        // If it's a rating, check if the user already rated this post
        if (type === 'rating') {
            const existing = yield Models_1.Reaction.findOne({
                where: { postId, userId, type: 'rating' },
            });
            if (existing) {
                // Update existing rating
                existing.value = value;
                yield existing.save();
                return res.status(200).json({ message: 'Rating updated', data: existing });
            }
        }
        // If it's a like, prevent duplicate likes
        if (type === 'like') {
            const existing = yield Models_1.Reaction.findOne({
                where: { postId, userId, type: 'like' },
            });
            if (existing) {
                return res.status(409).json({ message: 'Already liked' });
            }
        }
        const reaction = yield Models_1.Reaction.create({ type, value, postId, userId });
        return res.status(201).json({ message: 'Reaction created', data: reaction });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.createReaction = createReaction;
const deleteReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { postId, type } = req.body;
    try {
        const reaction = yield Models_1.Reaction.findOne({
            where: { postId, userId, type },
        });
        if (!reaction) {
            return res.status(404).json({ message: 'Reaction not found' });
        }
        yield reaction.destroy();
        return res.status(200).json({ message: 'Reaction removed' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteReaction = deleteReaction;
const getLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const likes = yield Models_1.Reaction.findAll({
            where: { postId, type: 'like' },
        });
        return res.status(200).json({ likes });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.getLikes = getLikes;
const getAverageRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const result = yield Models_1.Reaction.findOne({
            attributes: [
                [Models_1.Reaction.sequelize.fn('AVG', Models_1.Reaction.sequelize.col('value')), 'avgRating'],
            ],
            where: { postId, type: 'rating' },
            raw: true,
        });
        const average = parseFloat((result === null || result === void 0 ? void 0 : result.avgRating) || '0');
        return res.status(200).json({ average });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.getAverageRating = getAverageRating;
