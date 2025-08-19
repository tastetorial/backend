"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPReason = exports.OTPType = exports.CreatorStatus = exports.VideoStatus = exports.ReactionType = exports.UserRole = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CREATOR"] = "creator";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "like";
    ReactionType["RATING"] = "rating";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
var VideoStatus;
(function (VideoStatus) {
    VideoStatus["PUBLISHED"] = "published";
    VideoStatus["DRAFT"] = "draft";
    VideoStatus["ARCHIVED"] = "archived";
})(VideoStatus || (exports.VideoStatus = VideoStatus = {}));
var CreatorStatus;
(function (CreatorStatus) {
    CreatorStatus["PENDING"] = "pending";
    CreatorStatus["APPROVED"] = "approved";
    CreatorStatus["DECLINED"] = "declined";
    CreatorStatus["REVOKED"] = "revoked";
    CreatorStatus["SUSPENDED"] = "suspended";
})(CreatorStatus || (exports.CreatorStatus = CreatorStatus = {}));
var OTPType;
(function (OTPType) {
    OTPType["EMAIL"] = "email";
    OTPType["PHONE"] = "phone";
})(OTPType || (exports.OTPType = OTPType = {}));
var OTPReason;
(function (OTPReason) {
    OTPReason["FORGOT_PASSWORD"] = "forgot_password";
    OTPReason["VERIFY_EMAIL"] = "verify_email";
})(OTPReason || (exports.OTPReason = OTPReason = {}));
