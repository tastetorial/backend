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
exports.getVideos = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, } = req.user;
    const { page = 1, limit, category, search, categoryId, orderBy } = req.query;
    try {
        const videos = yield Models_1.Video.findAll({
            where: {},
            include: [{
                    model: Models_1.User,
                    attributes: { exclude: ['password'] }
                }, {
                    model: Models_1.Category
                }]
        });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'Error getting videos');
    }
});
exports.getVideos = getVideos;
