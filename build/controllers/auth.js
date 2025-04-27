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
exports.me = exports.sendOTP = exports.verifyOTP = exports.login = exports.register2 = exports.register = void 0;
const modules_1 = require("../utils/modules");
const Models_1 = require("../models/Models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const email_1 = require("../services/email");
const jsonwebtoken_1 = require("jsonwebtoken");
const configSetup_1 = __importDefault(require("../config/configSetup"));
const OTP_1 = require("../models/OTP");
const messages_1 = require("../utils/messages");
const User_1 = require("../models/User");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, phone, firstName, lastName, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return (0, modules_1.handleResponse)(res, 400, false, 'Password does not match');
    }
    if (!(0, modules_1.validateEmail)(email)) {
        return (0, modules_1.handleResponse)(res, 400, false, 'Invalid email');
    }
    try {
        let oldUser = yield Models_1.User.findOne({ where: { email: email } });
        if (oldUser) {
            return (0, modules_1.handleResponse)(res, 400, false, 'User already exists');
        }
        let hashPassword = yield bcryptjs_1.default.hash(password, 10);
        //user id
        const userId = `00${(0, modules_1.getRandom)(7)}`;
        const user = yield Models_1.User.create({
            email,
            userId,
            phone,
            password: hashPassword,
            role: User_1.UserRole.USER
        });
        user.password = undefined;
        const profile = yield Models_1.Profile.create({
            firstName,
            lastName,
            userId: user.id
        });
        let otp = (0, modules_1.getRandom)(6).toString();
        let otpExpires = new Date(Date.now() + configSetup_1.default.OTP_EXPIRY_TIME * 60 * 1000);
        let otpRecord = yield Models_1.OTP.create({ email, otp, expiresAt: otpExpires });
        let emailSendStatus;
        let messageId = yield (0, email_1.sendEmail)(email, (0, messages_1.welcomeEmail)(otp).subject, (0, messages_1.welcomeEmail)(otp).body, profile.firstName);
        emailSendStatus = Boolean(messageId);
        return (0, modules_1.handleResponse)(res, 200, true, 'User registered successfully', {
            user, emailSendStatus
        });
    }
    catch (error) {
        return (0, modules_1.handleResponse)(res, 500, false, 'An error occurred', error);
    }
});
exports.register = register;
const register2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.user;
    const { otherNames, dateOfBirth, address, description, privacy, postCode, category } = req.body;
    if (!dateOfBirth || !address || !privacy || !postCode || !category)
        return (0, modules_1.handleResponse)(res, 400, false, 'Please provide all required fields');
    try {
        let updated = yield Models_1.Profile.update({
            otherNames,
            dateOfBirth,
            address,
            description,
            privacy,
            postCode,
            category,
        }, {
            where: {
                userId: id
            }
        });
        return (0, modules_1.handleResponse)(res, 200, true, 'Profile updated successfully', updated);
    }
    catch (error) {
        return (0, modules_1.handleResponse)(res, 500, false, error.message);
    }
});
exports.register2 = register2;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    if (!email || !password)
        return (0, modules_1.handleResponse)(res, 400, false, 'Please provide email and password');
    try {
        let user = yield Models_1.User.findOne({ where: { email } });
        if (!user)
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        let passwordMatch = yield bcryptjs_1.default.compare(password, user.password || '');
        if (!passwordMatch)
            return (0, modules_1.handleResponse)(res, 401, false, 'Invalid password');
        user.password = undefined;
        let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email, role: user.role }, configSetup_1.default.TOKEN_SECRET);
        return (0, modules_1.successResponse)(res, 'Login successful', {
            user: user,
            token: token
        });
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', error);
    }
});
exports.login = login;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, otp, reason } = req.body;
    let otpRecord = yield Models_1.OTP.findOne({ where: { email, otp } });
    if (!otpRecord)
        return (0, modules_1.handleResponse)(res, 404, false, 'OTP not found');
    if (otpRecord.expiresAt < new Date()) {
        otpRecord.destroy();
        return (0, modules_1.handleResponse)(res, 401, false, 'OTP expired');
    }
    if (reason === OTP_1.OTPReason.VERIFY_EMAIL) {
        let user = yield Models_1.User.findOne({ where: { email } });
        if (!user)
            return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
        user.emailVerified = true;
        yield user.save();
    }
    yield otpRecord.destroy();
    return (0, modules_1.successResponse)(res, 'OTP verified');
});
exports.verifyOTP = verifyOTP;
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, reason } = req.body;
    let user = yield Models_1.User.findOne({ where: { email } });
    if (!user)
        return (0, modules_1.handleResponse)(res, 404, false, 'User not found');
    let otp = (0, modules_1.getRandom)(6).toString();
    let otpExpires = new Date(Date.now() + configSetup_1.default.OTP_EXPIRY_TIME * 60 * 1000);
    let otpRecord = yield Models_1.OTP.create({ email, otp, expiresAt: otpExpires });
    let emailSendStatus;
    if (reason === OTP_1.OTPReason.FORGOT_PASSWORD) {
        let resetEmail = (0, messages_1.passwordReset)(otp);
        let messageId = yield (0, email_1.sendEmail)(email, resetEmail.subject, resetEmail.body, 'User');
        emailSendStatus = Boolean(messageId);
    }
    else if (reason === OTP_1.OTPReason.VERIFY_EMAIL) {
        let emailSent = (0, messages_1.verifyEmail)(otp);
        let messageId = yield (0, email_1.sendEmail)(email, emailSent.subject, emailSent.body, 'User');
        emailSendStatus = Boolean(messageId);
    }
    return (0, modules_1.successResponse)(res, 'OTP sent', { emailSendStatus });
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
                    model: Models_1.Profile,
                    as: 'profile'
                }, {
                    model: Models_1.Post,
                    as: 'posts',
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
