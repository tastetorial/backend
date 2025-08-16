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
exports.getVideos = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const sequelize_1 = require("sequelize");
const enum_1 = require("../enum");
const query_1 = require("../validation/query");
const db_1 = __importDefault(require("../config/db"));
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, } = req.user;
    const result = query_1.videoQuerySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { page = 1, limit = 10, category, search, categoryId, orderBy, orderDir } = result.data;
    try {
        const videos = yield Models_1.Video.findAll({
            where: Object.assign(Object.assign(Object.assign({}, (categoryId && { categoryId })), (search && {
                [sequelize_1.Op.or]: [
                    { title: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } }
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
                    where: Object.assign({}, (category && { name: { [sequelize_1.Op.like]: `%${category}%` } }))
                }],
            order: [
                ...(orderBy === 'likes' ?
                    [[db_1.default.literal('likes'), orderDir.toUpperCase()]]
                    : []),
                ...(orderBy === 'comments' ?
                    [[db_1.default.literal('comments'), orderDir.toUpperCase()]]
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
