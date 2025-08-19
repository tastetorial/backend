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
exports.deleteComment = exports.editComment = exports.addComment = exports.getComments = exports.isLiked = exports.toogleLike = void 0;
const Reaction_1 = require("../models/Reaction");
const modules_1 = require("../utils/modules");
const body_1 = require("../validation/body");
const sequelize_1 = require("sequelize");
const toogleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { videoId } = req.params;
    try {
        const [reaction, created] = yield Reaction_1.Reaction.findOrCreate({
            where: {
                videoId,
                userId: id
            }, defaults: {
                like: true
            }
        });
        if (!created) {
            reaction.like = !reaction.like;
            if (!reaction.like && !reaction.comment) {
                yield reaction.destroy();
            }
            else {
                yield reaction.save();
            }
        }
        return (0, modules_1.successResponse)(res, 'success', reaction);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Something went wrong');
    }
});
exports.toogleLike = toogleLike;
const isLiked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { videoId } = req.params;
    try {
        const reaction = yield Reaction_1.Reaction.findOne({
            where: {
                videoId,
                userId: id,
                like: true
            }
        });
        return (0, modules_1.successResponse)(res, 'success', { liked: reaction ? true : false });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Something went wrong');
    }
});
exports.isLiked = isLiked;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const comments = yield Reaction_1.Reaction.findAll({
            where: {
                videoId,
                comment: {
                    [sequelize_1.Op.ne]: null
                }
            },
            attributes: ['comment', 'createdAt']
        });
        return (0, modules_1.successResponse)(res, 'success', comments);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Something went wrong');
    }
});
exports.getComments = getComments;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = body_1.addCommentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            status: false,
            message: 'validation error',
            errors: result.error.format()
        });
    }
    const { videoId, comment } = result.data;
    try {
        const [reaction, created] = yield Reaction_1.Reaction.findOrCreate({
            where: {
                videoId,
                userId: id
            }, defaults: {
                comment
            }
        });
        if (!created) {
            reaction.comment = comment;
            yield reaction.save();
        }
        return (0, modules_1.successResponse)(res, 'success', reaction);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Something went wrong');
    }
});
exports.addComment = addComment;
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = body_1.addCommentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            status: false,
            message: 'validation error',
            errors: result.error.format()
        });
    }
    const { videoId, comment } = result.data;
    try {
        const reaction = yield Reaction_1.Reaction.findOne({
            where: {
                videoId,
                userId: id
            }
        });
        if (!reaction) {
            return (0, modules_1.errorResponse)(res, 'error', 'Reaction not found');
        }
        reaction.comment = comment;
        yield reaction.save();
        return (0, modules_1.successResponse)(res, 'success', reaction);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Something went wrong');
    }
});
exports.editComment = editComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { videoId } = req.params;
    try {
        const reaction = yield Reaction_1.Reaction.findOne({
            where: {
                videoId,
                userId: id
            }
        });
        if (!reaction) {
            return (0, modules_1.errorResponse)(res, 'error', 'Reaction not found');
        }
        if (reaction.like) {
            reaction.comment = null;
            yield reaction.save();
        }
        else {
            yield reaction.destroy();
        }
        return (0, modules_1.successResponse)(res, 'success', 'Comment deleted');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Something went wrong');
    }
});
exports.deleteComment = deleteComment;
