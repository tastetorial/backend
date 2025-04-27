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
exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const Post_1 = require("../models/Post");
const View_1 = require("../models/View");
const modules_1 = require("../utils/modules");
const Reaction_1 = require("../models/Reaction");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { title, body, views } = req.body;
    const post = yield Post_1.Post.create({
        title,
        body,
        userId: id,
        views
    }, {
        include: View_1.View
    });
    return (0, modules_1.successResponse)(res, 'success', post);
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const posts = yield Post_1.Post.findAll({
            // where: {
            //     userId: id
            // },
            include: [View_1.View, Reaction_1.Reaction]
        });
        const newPosts = posts.map((post) => {
            return Object.assign(Object.assign({}, post.dataValues), { views: post === null || post === void 0 ? void 0 : post.views.map((view) => {
                    return {
                        id: view.id,
                        image: JSON.parse(view.images),
                        postType: view.postType,
                        viewType: view.viewType,
                        options: JSON.parse(view.options),
                        postId: view.postId
                    };
                }) });
        });
        return (0, modules_1.successResponse)(res, 'success', newPosts);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.getPosts = getPosts;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const post = yield Post_1.Post.findOne({
            where: {
                id: postId,
            },
            include: [View_1.View, Reaction_1.Reaction]
        });
        const views = post === null || post === void 0 ? void 0 : post.views.map((view) => {
            return {
                id: view.id,
                image: JSON.parse(view.images),
                postType: view.postType,
                viewType: view.viewType,
                options: JSON.parse(view.options),
                postId: view.postId
            };
        });
        return (0, modules_1.successResponse)(res, 'success', Object.assign(Object.assign({}, post === null || post === void 0 ? void 0 : post.dataValues), { views }));
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.getPost = getPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { postId } = req.params;
    try {
        const post = yield Post_1.Post.update(req.body, {
            where: {
                id: postId
            }
        });
        return (0, modules_1.successResponse)(res, 'success', post);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { postId } = req.params;
    try {
        const post = yield Post_1.Post.findOne({
            where: {
                id: postId,
                userId: id
            }
        });
        if (!post) {
            return (0, modules_1.handleResponse)(res, 404, false, 'Post not found');
        }
        yield post.destroy();
        return (0, modules_1.successResponse)(res, 'success', 'Post deleted successfully');
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.deletePost = deletePost;
