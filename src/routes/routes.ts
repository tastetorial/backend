const express = require('express');
const router = express.Router();
import { sendOTP, verifyOTP, login, me } from "../controllers/auth";
import { upload } from "../utils/upload";
import { allowRoles } from "../middleware/allowRoles";
import { register } from "../controllers/auth";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post";
import { follow, getFollowers, getFollowing, isFollowing, unfollow } from "../controllers/follow";
import { createReaction, deleteReaction, getAverageRating, getLikes } from "../controllers/reaction";
import { getProfile, getProfiles } from "../controllers/profile";
import { uploadAvatar, uploadFile, uploadFiles } from "../controllers/upload";

router.post('/auth/register', register)
router.post('/auth/send-otp', sendOTP)
router.post('/auth/verify-otp', verifyOTP)
router.post('/auth/login', login)
router.get('/auth/me', me)

router.get('/profiles', getProfiles);
router.get('/profiles/:userId', getProfile);

router.post('/uploads/avatar', upload.single('avatar'), uploadAvatar)
router.post('/uploads/single', upload.single('file'), uploadFile)
router.post('/uploads/multiple', upload.array('files'), uploadFiles)

router.get('/posts', getPosts);
router.get('/posts/:postId', getPost);
router.post('/posts', createPost);
router.put('/posts/:postId', updatePost)
router.delete('/posts/:postId', deletePost)

router.post('/follow', follow);
router.delete('/unfollow', unfollow);
router.get('/is-following', isFollowing);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

router.post('/reactions', createReaction);
router.delete('/reactions', deleteReaction);
router.get('/reactions/likes/:postId', getLikes);
router.get('/reactions/ratings/:postId', getAverageRating);

export default router;