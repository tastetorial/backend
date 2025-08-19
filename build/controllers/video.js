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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishVideo = exports.archiveVideo = exports.viewVideo = exports.updateVideo = exports.createVideo = exports.getVideo = exports.getMyVideos = exports.getVideos = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const sequelize_1 = require("sequelize");
const enum_1 = require("../enum");
const query_1 = require("../validation/query");
const db_1 = __importDefault(require("../config/db"));
const body_1 = require("../validation/body");
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, } = req.user;
    const result = query_1.videoQuerySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { page = 1, limit = 10, search, categoryId, orderBy, orderDir } = result.data;
    try {
        const videos = yield Models_1.Video.findAll({
            where: Object.assign(Object.assign(Object.assign({}, (categoryId && { categoryId })), (search && {
                [sequelize_1.Op.or]: [
                    { title: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                    { tags: { [sequelize_1.Op.like]: `%${search}%` } }
                ]
            })), { status: enum_1.VideoStatus.PUBLISHED }),
            attributes: {
                include: [
                    [
                        db_1.default.literal(`(
                      SELECT SUM(CAST([like] AS INT))
                      FROM reactions
                      WHERE reactions.videoId = Video.id
                    )`),
                        'likes'
                    ],
                    [
                        db_1.default.literal(`(
                      SELECT COUNT([comment])
                      FROM reactions
                      WHERE reactions.videoId = Video.id
                    )`),
                        'comments'
                    ]
                ]
            },
            limit: limit,
            offset: (page - 1) * limit,
            include: [{
                    model: Models_1.User,
                    as: 'creator',
                    attributes: { exclude: ['password'] },
                }, {
                    model: Models_1.Category,
                }],
            order: [
                ...(orderBy === 'likes' ?
                    [[db_1.default.literal('likes'), (orderDir || 'DESC').toUpperCase()]]
                    : []),
                ...(orderBy === 'comments' ?
                    [[db_1.default.literal('comments'), (orderDir || 'DESC').toUpperCase()]]
                    : []),
                ...(orderBy !== 'likes' && orderBy !== 'comments'
                    ? [[orderBy || 'createdAt', (orderDir || 'DESC').toUpperCase()]]
                    : [])
            ]
        });
        return (0, modules_1.successResponse)(res, 'success', videos);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'Error getting videos');
    }
});
exports.getVideos = getVideos;
const getMyVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = query_1.myVideoQuerySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { status, page, limit, orderBy, orderDir } = result.data;
    try {
        const videos = yield Models_1.Video.findAll({
            where: Object.assign({ userId: id }, (status && { status })),
            attributes: {
                include: [
                    [
                        db_1.default.literal(`(
                      SELECT SUM(CAST([like] AS INT))
                      FROM reactions
                      WHERE reactions.videoId = Video.id
                    )`),
                        'likes'
                    ],
                    [
                        db_1.default.literal(`(
                      SELECT COUNT([comment])
                      FROM reactions
                      WHERE reactions.videoId = Video.id
                    )`),
                        'comments'
                    ]
                ]
            },
            limit: limit,
            offset: (page - 1) * limit,
            include: [{
                    model: Models_1.Category,
                }],
            order: [
                ...(orderBy === 'likes' ?
                    [[db_1.default.literal('likes'), (orderDir || 'DESC').toUpperCase()]]
                    : []),
                ...(orderBy === 'comments' ?
                    [[db_1.default.literal('comments'), (orderDir || 'DESC').toUpperCase()]]
                    : []),
                ...(orderBy !== 'likes' && orderBy !== 'comments'
                    ? [[orderBy || 'createdAt', (orderDir || 'DESC').toUpperCase()]]
                    : [])
            ]
        });
        return (0, modules_1.successResponse)(res, 'success', videos);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.getMyVideos = getMyVideos;
const getVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const video = yield Models_1.Video.findOne({
            where: { id: videoId },
            include: [{
                    model: Models_1.Category,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                }, {
                    model: Models_1.User,
                    attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'avatar']
                }, {
                    model: Models_1.Reaction,
                    where: { [sequelize_1.Op.not]: { comment: null } },
                    attributes: ['id', 'comment', 'userId'],
                    include: [{
                            model: Models_1.User,
                            attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'avatar']
                        }]
                }]
        });
        return (0, modules_1.successResponse)(res, 'success', video);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.getVideo = getVideo;
const createVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.user;
    const validation = body_1.createVideoSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.flatten() });
    }
    const { title, description, tags, categoryId, thumbnailUrl, videoUrl, status } = validation.data;
    try {
        const video = yield Models_1.Video.create({
            title,
            description,
            tags,
            videoUrl,
            thumbnailUrl,
            status,
            categoryId,
            userId: id
        });
        return (0, modules_1.successResponse)(res, 'success', video);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.createVideo = createVideo;
const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.user;
    const { videoId } = req.params;
    if (!videoId) {
        return (0, modules_1.errorResponse)(res, 'error', 'Video Id is required');
    }
    if (isNaN(parseInt(videoId))) {
        return (0, modules_1.errorResponse)(res, 'error', 'Invalid Video Id');
    }
    const validation = body_1.updateVideoSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.flatten() });
    }
    try {
        const updated = yield Models_1.Video.update(validation.data, {
            where: {
                id: videoId,
                userId: id
            }
        });
        if (updated[0] === 0) {
            return (0, modules_1.errorResponse)(res, 'error', 'Video not found');
        }
        return (0, modules_1.successResponse)(res, 'success', updated);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.updateVideo = updateVideo;
const viewVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { videoId } = req.params;
    if (!videoId) {
        return (0, modules_1.errorResponse)(res, 'error', 'Video Id is required');
    }
    if (isNaN(parseInt(videoId))) {
        return (0, modules_1.errorResponse)(res, 'error', 'Invalid Video Id');
    }
    try {
        const video = yield Models_1.Video.findByPk(videoId);
        if (!video) {
            return (0, modules_1.handleResponse)(res, 404, false, 'Video not found');
        }
        const alreadyViewed = yield Models_1.VideoView.findOne({ where: { userId: id, videoId } });
        if (alreadyViewed) {
            return (0, modules_1.successResponse)(res, 'success', 'Video already viewed');
        }
        yield Models_1.VideoView.create({
            userId: id,
            videoId,
            viewedAt: new Date()
        });
        yield Models_1.Video.increment('views', { by: 1, where: { id: videoId } });
        return (0, modules_1.successResponse)(res, 'success', 'Video viewed');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.viewVideo = viewVideo;
const archiveVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { videoId } = req.params;
    if (!videoId) {
        return (0, modules_1.errorResponse)(res, 'error', 'Video Id is required');
    }
    if (isNaN(parseInt(videoId))) {
        return (0, modules_1.errorResponse)(res, 'error', 'Invalid Video Id');
    }
    try {
        const updated = yield Models_1.Video.update({
            status: enum_1.VideoStatus.ARCHIVED
        }, {
            where: {
                id: videoId,
                userId: id
            }
        });
        if (updated[0] === 0) {
            return (0, modules_1.errorResponse)(res, 'error', 'Video not found');
        }
        return (0, modules_1.successResponse)(res, 'success', 'Video archived');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.archiveVideo = archiveVideo;
const publishVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { videoId } = req.params;
    if (!videoId) {
        return (0, modules_1.errorResponse)(res, 'error', 'Video Id is required');
    }
    if (isNaN(parseInt(videoId))) {
        return (0, modules_1.errorResponse)(res, 'error', 'Invalid Video Id');
    }
    try {
        const updated = yield Models_1.Video.update({
            status: enum_1.VideoStatus.PUBLISHED
        }, {
            where: {
                id: videoId,
                userId: id
            }
        });
        if (updated[0] === 0) {
            return (0, modules_1.errorResponse)(res, 'error', 'Video not found');
        }
        return (0, modules_1.successResponse)(res, 'success', 'Video published');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal Server Error');
    }
});
exports.publishVideo = publishVideo;
