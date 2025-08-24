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
exports.me = exports.sendOTP = exports.verifyOTP = exports.resetPassword = exports.changePassword = exports.updateProfile = exports.login = exports.activateAccount = exports.register = void 0;
const modules_1 = require("../utils/modules");
const Models_1 = require("../models/Models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const email_1 = require("../services/email");
const jsonwebtoken_1 = require("jsonwebtoken");
const configSetup_1 = __importDefault(require("../config/configSetup"));
const enum_1 = require("../enum");
const messages_1 = require("../utils/messages");
const enum_2 = require("../enum");
const body_1 = require("../validation/body");
const sequelize_1 = require("sequelize");
const crypto_1 = __importDefault(require("crypto"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = body_1.registerSchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json({
            error: "Invalid input",
            issues: result.error.format()
        });
    let { email, phone, firstname, lastname, password, confirmPassword } = result.data;
    if (password !== confirmPassword) {
        return (0, modules_1.handleResponse)(res, 400, false, 'Password does not match');
    }
    if (!(0, modules_1.validateEmail)(email)) {
        return (0, modules_1.handleResponse)(res, 400, false, 'Invalid email');
    }
    try {
        let oldUser = yield Models_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if (oldUser) {
            return (0, modules_1.handleResponse)(res, 400, false, 'User already exists');
        }
        let hashPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield Models_1.User.create({
            email,
            phone,
            firstname: firstname,
            username: firstname + (0, modules_1.randomId)(6),
            lastname: lastname,
            password: hashPassword,
            role: enum_2.UserRole.VIEWER
        });
        user.password = undefined;
        let otp = crypto_1.default.randomBytes(32).toString("hex");
        let otpExpires = new Date(Date.now() + configSetup_1.default.OTP_EXPIRY_TIME * 60 * 1000);
        let otpRecord = yield Models_1.OTP.create({ email, otp, expiresAt: otpExpires });
        const activationLink = `${configSetup_1.default.CLIENT_URL}/auth_screen2.html?token=${otp}`;
        let emailSendStatus;
        let emailToSend = (0, messages_1.welcomeEmail2)(activationLink);
        let messageId = yield (0, email_1.sendEmail)(email, emailToSend.subject, emailToSend.body, user.firstname);
        emailSendStatus = Boolean(messageId);
        return (0, modules_1.handleResponse)(res, 200, true, 'User registered successfully', {
            user, emailSendStatus
        });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.register = register;
const activateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    try {
        const otp = yield Models_1.OTP.findOne({
            where: {
                otp: token,
                expiresAt: { [sequelize_1.Op.gt]: new Date() }
            }
        });
        if (!otp) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const user = yield Models_1.User.findOne({
            where: {
                email: otp.email
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.emailVerified = true;
        yield user.save();
        return (0, modules_1.successResponse)(res, 'success', 'Account activated successfully');
    }
    catch (err) {
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.activateAccount = activateAccount;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = body_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    let { email, password } = result.data;
    try {
        let user = yield Models_1.User.findOne({ where: { email } });
        if (!user)
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        let passwordMatch = yield bcryptjs_1.default.compare(password, user.password || '');
        if (!passwordMatch)
            return (0, modules_1.handleResponse)(res, 401, false, 'Invalid password');
        user.password = undefined;
        if (!user.emailVerified)
            return (0, modules_1.handleResponse)(res, 401, false, 'Please verify your email');
        let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email, role: user.role }, configSetup_1.default.TOKEN_SECRET);
        return (0, modules_1.successResponse)(res, 'Login successful', {
            user: user,
            token: token
        });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.login = login;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = body_1.updateProfileSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const updated = yield Models_1.User.update(result.data, {
            where: { id: req.user.id }
        });
        return (0, modules_1.successResponse)(res, 'Profile updated successfully', {});
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = body_1.changePasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { oldPassword, newPassword } = result.data;
    try {
        const user = yield Models_1.User.findOne({
            where: { id: req.user.id }
        });
        if (!user) {
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        }
        const match = yield bcryptjs_1.default.compare(oldPassword, user.password || '');
        if (!match) {
            return (0, modules_1.handleResponse)(res, 400, false, 'Old password does not match');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        const updated = yield Models_1.User.update({ password: hashedPassword }, {
            where: { id: req.user.id }
        });
        return (0, modules_1.successResponse)(res, 'Password changed successfully');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.changePassword = changePassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = body_1.resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { email, newPassword } = result.data;
    try {
        const user = yield Models_1.User.findOne({
            where: { email }
        });
        if (!user) {
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        const updated = yield Models_1.User.update({ password: hashedPassword }, {
            where: { id: user.id }
        });
        return (0, modules_1.successResponse)(res, 'Password reset successfully');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.resetPassword = resetPassword;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = body_1.verifyOTPSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    let { email, otp, reason } = result.data;
    try {
        let otpRecord = yield Models_1.OTP.findOne({ where: { email, otp } });
        if (!otpRecord)
            return (0, modules_1.handleResponse)(res, 404, false, 'OTP not found');
        if (otpRecord.expiresAt < new Date()) {
            otpRecord.destroy();
            return (0, modules_1.handleResponse)(res, 401, false, 'OTP expired');
        }
        if (reason === enum_1.OTPReason.VERIFY_EMAIL) {
            let user = yield Models_1.User.findOne({ where: { email } });
            if (!user)
                return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
            user.emailVerified = true;
            yield user.save();
        }
        yield otpRecord.destroy();
        return (0, modules_1.successResponse)(res, 'OTP verified');
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.verifyOTP = verifyOTP;
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, reason } = req.body;
        let user = yield Models_1.User.findOne({ where: { email } });
        if (!user)
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        let otp = (0, modules_1.getRandom)(6).toString();
        let otpExpires = new Date(Date.now() + configSetup_1.default.OTP_EXPIRY_TIME * 60 * 1000);
        let otpRecord = yield Models_1.OTP.create({ email, otp, expiresAt: otpExpires });
        let emailSendStatus;
        if (reason === enum_1.OTPReason.FORGOT_PASSWORD) {
            let resetEmail = (0, messages_1.passwordReset)(otp);
            let messageId = yield (0, email_1.sendEmail)(email, resetEmail.subject, resetEmail.body, 'User');
            emailSendStatus = Boolean(messageId);
        }
        else if (reason === enum_1.OTPReason.VERIFY_EMAIL) {
            let emailSent = (0, messages_1.verifyEmail)(otp);
            let messageId = yield (0, email_1.sendEmail)(email, emailSent.subject, emailSent.body, 'User');
            emailSendStatus = Boolean(messageId);
        }
        return (0, modules_1.successResponse)(res, 'OTP sent', { emailSendStatus });
    }
    catch (error) {
        console.log(error);
        return (0, modules_1.errorResponse)(res, 'Error sending OTP', error);
    }
});
exports.sendOTP = sendOTP;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const user = yield Models_1.User.findByPk(id, {
            attributes: {
                exclude: ['password'],
            },
            include: [{
                    model: Models_1.Video,
                    as: 'videos',
                }, {
                    model: Models_1.User,
                    as: 'followings',
                }, {
                    model: Models_1.User,
                    as: 'followers',
                }]
        });
        return (0, modules_1.successResponse)(res, 'success', user);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.me = me;
