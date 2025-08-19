const express = require('express');
const router = express.Router();
import { register, sendOTP, verifyOTP, login, me, resetPassword, changePassword, updateProfile } from "../controllers/auth";
import { upload } from "../utils/upload";
import { follow, getFollowers, getFollowing, isFollowing, unfollow } from "../controllers/follow";
// import { createReaction, deleteReaction, getAverageRating, getLikes } from "../controllers/reaction";
// import { getProfile, getProfiles } from "../controllers/profile";
import { uploadFile } from "../controllers/upload";
import { archiveVideo, createVideo, getMyVideos, getVideo, getVideos, publishVideo, updateVideo, viewVideo } from "../controllers/video";
import { allowRoles } from "../middleware/allowRoles";
import { UserRole } from "../enum";
import { approveCreator, getCreator, getCreators, rejectCreator, upgradeToCreator } from "../controllers/creator";
import { addComment, deleteComment, editComment, getComments, isLiked, toogleLike } from '../controllers/reaction'

router.post('/auth/register', register)
router.post('/auth/send-otp', sendOTP)
router.post('/auth/verify-otp', verifyOTP)
router.post('/auth/login', login)
router.get('/auth/me', me)

router.post('/auth/reset-password', resetPassword)
router.post('/auth/change-password', allowRoles('*'), changePassword)

router.post('update-profile', allowRoles('*'), updateProfile)

// router.get('/profiles', getProfiles);
// router.get('/profiles/:userId', getProfile);

router.post('/uploads/avatar', allowRoles('*'), upload.single('avatar'), uploadFile)
router.post('/uploads/video', allowRoles(UserRole.CREATOR), upload.single('video'), uploadFile)
router.post('/uploads/thumbnail', allowRoles(UserRole.CREATOR), upload.single('thumbnail'), uploadFile)

router.post('/upgrade-to-creator', allowRoles(UserRole.VIEWER), upgradeToCreator)
router.get('/admin/creators', allowRoles(UserRole.ADMIN), getCreators)
router.get('/admin/creators/:creatorId', allowRoles(UserRole.ADMIN), getCreator)
router.post('/admin/approve-creator/:creatorId', allowRoles(UserRole.ADMIN), approveCreator)
router.post('/admin/reject-creator/:creatorId', allowRoles(UserRole.ADMIN), rejectCreator)

router.get('/videos', allowRoles('*'), getVideos);
router.get('/my-videos', allowRoles(UserRole.CREATOR), getMyVideos);
router.get('/videos/:videoId', allowRoles('*'), getVideo);
router.post('/videos', allowRoles(UserRole.CREATOR), createVideo);
router.put('/videos/:videoId', allowRoles(UserRole.CREATOR), updateVideo);
router.post('/view-video/:videoId', allowRoles('*'), viewVideo);
router.post('/archive-video/:videoId', allowRoles(UserRole.CREATOR), archiveVideo);
router.post('/publish-video/:videoId', allowRoles(UserRole.CREATOR), publishVideo);

router.post('/follow', follow);
router.delete('/unfollow', unfollow);
router.get('/is-following/:followingId', isFollowing);
router.get('/followers', getFollowers);
router.get('/followings', getFollowing);

router.post('/toggle-like/:videoId', toogleLike)
router.get('/is-liked/:videoId', isLiked)
router.get('/comment/:videoId', getComments)
router.post('/comment', addComment)
router.put('/comment/', editComment)
router.delete('/comment/:videoId', deleteComment)

export default router;