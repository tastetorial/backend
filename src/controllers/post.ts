import { Request, Response } from "express"
import { Post } from "../models/Post";
import { View } from "../models/View";
import { errorResponse, handleResponse, successResponse } from "../utils/modules";
import { Reaction } from "../models/Reaction";

export const createPost = async (req: Request, res: Response) => {
    const { id } = req.user;

    const { title, body, views } = req.body;

    const post = await Post.create({
        title,
        body,
        userId: id,
        views
    }, {
        include: View
    })

    return successResponse(res, 'success', post);
}

export const getPosts = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const posts = await Post.findAll({
            // where: {
            //     userId: id
            // },

            include: [View, Reaction]
        })


        const newPosts = posts.map((post) => {
            return {
                ...post.dataValues,
                views: post?.views.map((view) => {
                    return {
                        id: view.id,
                        image: JSON.parse(view.images),
                        postType: view.postType,
                        viewType: view.viewType,
                        options: JSON.parse(view.options),
                        postId: view.postId
                    }
                })
            }
        })


        return successResponse(res, 'success', newPosts);
    } catch (error) {
        return errorResponse(res, 'error', error);
    }
}

export const getPost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await Post.findOne({
            where: {
                id: postId,
            },
            include: [View, Reaction]
        })

        const views = post?.views.map((view) => {
            return {
                id: view.id,
                image: JSON.parse(view.images),
                postType: view.postType,
                viewType: view.viewType,
                options: JSON.parse(view.options),
                postId: view.postId
            }
        })

        return successResponse(res, 'success', { ...post?.dataValues, views });
    } catch (error) {
        return errorResponse(res, 'error', error);
    }
}

export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.user;
    const { postId } = req.params;

    try {
        const post = await Post.update(req.body, {
            where: {
                id: postId
            }
        })

        return successResponse(res, 'success', post);
    } catch (error) {
        return errorResponse(res, 'error', error);
    }
}

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.user;
    const { postId } = req.params;

    try {
        const post = await Post.findOne({
            where: {
                id: postId,
                userId: id
            }
        })

        if (!post) {
            return handleResponse(res, 404, false, 'Post not found');
        }

        await post.destroy();
        return successResponse(res, 'success', 'Post deleted successfully');
    } catch (error) {
        return errorResponse(res, 'error', error);
    }
}

