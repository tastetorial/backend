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
exports.isSavedVideo = exports.toggleSaveVideo = exports.getMySavedVideos = void 0;
const SavedVideo_1 = require("../models/SavedVideo");
const Models_1 = require("../models/Models");
const db_1 = __importDefault(require("../config/db"));
const modules_1 = require("../utils/modules");
const query_1 = require("../validation/query");
const getMySavedVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = query_1.pagination.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { page, limit } = result.data;
    try {
        const videos = yield SavedVideo_1.SavedVideo.findAll({
            where: {
                userId: id
            },
            include: [{
                    model: Models_1.Video,
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
                    include: [{
                            model: Models_1.User,
                            attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'avatar']
                        }]
                }],
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        });
        return (0, modules_1.successResponse)(res, 'success', videos);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Error while getting saved videos');
    }
});
exports.getMySavedVideos = getMySavedVideos;
const toggleSaveVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const savedVideo = yield SavedVideo_1.SavedVideo.findOne({
            where: {
                userId: req.user.id,
                videoId
            }
        });
        if (savedVideo) {
            yield savedVideo.destroy();
            return (0, modules_1.successResponse)(res, 'success', { saved: false, message: 'Removed from saved videos' });
        }
        const saved = SavedVideo_1.SavedVideo.create({
            userId: req.user.id,
            videoId
        });
        return (0, modules_1.successResponse)(res, 'success', { saved: true, message: 'Video saved' });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Error while saving video');
    }
});
exports.toggleSaveVideo = toggleSaveVideo;
const isSavedVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const savedVideo = yield SavedVideo_1.SavedVideo.findOne({
            where: {
                userId: req.user.id,
                videoId
            }
        });
        if (savedVideo) {
            return (0, modules_1.successResponse)(res, 'success', { saved: true });
        }
        return (0, modules_1.successResponse)(res, 'success', { saved: false });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Error while checking saved video');
    }
});
exports.isSavedVideo = isSavedVideo;
