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
exports.getCreator = exports.getCreators = exports.rejectCreator = exports.approveCreator = exports.upgradeToCreator = void 0;
const body_1 = require("../validation/body");
const modules_1 = require("../utils/modules");
const Models_1 = require("../models/Models");
const enum_1 = require("../enum");
const query_1 = require("../validation/query");
const sequelize_1 = require("sequelize");
const messages_1 = require("../utils/messages");
const email_1 = require("../services/email");
const upgradeToCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = body_1.creatorSchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json({
            error: "Invalid input",
            issues: result.error.format()
        });
    const { bio } = result.data;
    try {
        const user = yield Models_1.User.findByPk(id);
        if (!user) {
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        }
        if (user.role !== enum_1.UserRole.VIEWER) {
            return (0, modules_1.handleResponse)(res, 400, false, 'You must be a viewer to upgrade to a creator');
        }
        const creator = yield Models_1.Creator.create({
            userId: id,
            bio,
            status: enum_1.CreatorStatus.PENDING
        });
        return (0, modules_1.successResponse)(res, 'success', 'Creator account created successfully, please wait for approval');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'An error occurred');
    }
});
exports.upgradeToCreator = upgradeToCreator;
const approveCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const creator = yield Models_1.Creator.findByPk(creatorId, {
            include: [Models_1.User]
        });
        if (!creator) {
            return (0, modules_1.handleResponse)(res, 404, false, 'Creator not found');
        }
        if (creator.status !== enum_1.CreatorStatus.PENDING) {
            return (0, modules_1.handleResponse)(res, 400, false, 'Creator account already approved/declined');
        }
        creator.status = enum_1.CreatorStatus.APPROVED;
        yield creator.save();
        creator.user.role = enum_1.UserRole.CREATOR;
        yield creator.user.save();
        let emailToSend = (0, messages_1.approvalEmail)();
        let messageId = yield (0, email_1.sendEmail)(creator.user.email, emailToSend.subject, emailToSend.body, creator.user.firstname);
        let emailSendStatus = Boolean(messageId);
        return (0, modules_1.successResponse)(res, 'success', {
            message: 'Creator account approved successfully',
            emailSendStatus
        });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'An error occurred');
    }
});
exports.approveCreator = approveCreator;
const rejectCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const creator = yield Models_1.Creator.findByPk(creatorId, {
            include: [Models_1.User]
        });
        if (!creator) {
            return (0, modules_1.handleResponse)(res, 404, false, 'Creator not found');
        }
        if (creator.status !== enum_1.CreatorStatus.PENDING) {
            return (0, modules_1.handleResponse)(res, 400, false, 'Creator account already approved/declined');
        }
        creator.status = enum_1.CreatorStatus.DECLINED;
        yield creator.save();
        let emailToSend = (0, messages_1.rejectionEmail)();
        let messageId = yield (0, email_1.sendEmail)(creator.user.email, emailToSend.subject, emailToSend.body, creator.user.firstname);
        let emailSendStatus = Boolean(messageId);
        return (0, modules_1.successResponse)(res, 'success', {
            message: 'Creator account rejected successfully',
            emailSendStatus
        });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'An error occurred');
    }
});
exports.rejectCreator = rejectCreator;
const getCreators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = query_1.getCreatorQuerySchema.safeParse(req.query);
    if (!result.success)
        return res.status(400).json({
            error: "Invalid input",
            issues: result.error.format()
        });
    const { page, limit, status, search } = result.data;
    try {
        const creators = yield Models_1.Creator.findAll({
            where: Object.assign({}, (status && { status })),
            include: [
                {
                    model: Models_1.User,
                    as: 'user', // 👈 important alias
                    attributes: { exclude: ['password', 'deviceToken'] },
                    where: search
                        ? {
                            [sequelize_1.Op.or]: [
                                { firstname: { [sequelize_1.Op.like]: `%${search}%` } },
                                { lastname: { [sequelize_1.Op.like]: `%${search}%` } },
                                { username: { [sequelize_1.Op.like]: `%${search}%` } },
                                { email: { [sequelize_1.Op.like]: `%${search}%` } },
                            ],
                        }
                        : undefined, // 👈 don’t apply WHERE if search is empty
                },
            ],
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });
        return (0, modules_1.successResponse)(res, 'success', creators);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.getCreators = getCreators;
const getCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const creator = yield Models_1.Creator.findByPk(creatorId, {
            include: [{
                    model: Models_1.User,
                    attributes: { exclude: ['password', 'deviceToken'] },
                    include: [Models_1.Video]
                }]
        });
        return (0, modules_1.successResponse)(res, 'success', creator);
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.getCreator = getCreator;
