"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectionEmail = exports.approvalEmail = exports.welcomeEmail2 = exports.welcomeEmail = exports.verifyEmail = exports.passwordReset = void 0;
const configSetup_1 = __importDefault(require("../config/configSetup"));
const passwordReset = (otp) => {
    return {
        subject: "Password Reset",
        body: `
    <p>We have received a request to reset your password. Use the OTP below to reset your password.</p>
    <h1 style="text-align: center">${otp}</h1>
    <p>Note that this OTP expires in ${configSetup_1.default.OTP_EXPIRY_TIME} minutes</p>
    `
    };
};
exports.passwordReset = passwordReset;
const verifyEmail = (otp) => {
    return {
        subject: "Verify your email",
        body: `
    <p>We have received a request to verify your email. Use the OTP below to verify your email.</p>
   <h1 style="text-align: center">${otp}</h1>
    <p>Note that this OTP expires in ${configSetup_1.default.OTP_EXPIRY_TIME} minutes</p>
    `
    };
};
exports.verifyEmail = verifyEmail;
const welcomeEmail = (otp) => {
    return {
        subject: "Welcome to Tastetorial",
        body: `
    <p>You are welcome to Tastetorial App</p>
    <p>Use this OTP to verify our account</p>
    <h1 style="text-align: center">${otp}</h1>
    `
    };
};
exports.welcomeEmail = welcomeEmail;
const welcomeEmail2 = (link) => {
    return {
        subject: "Welcome to Tastetorial",
        body: `
    <p>You are welcome to Tastetorial App</p>
    <p>Click this link to activate your account</p>
    <a style="text-align: center; display: block; margin: 0 auto; text-decoration: none; color: #fff; background-color: #FF3D00; border-color: #FF3D00; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem;" href="${link}">Activate Your Account</a>
    `
    };
};
exports.welcomeEmail2 = welcomeEmail2;
const approvalEmail = () => {
    return {
        subject: "Your creator profile has been approved",
        body: `
    <p>Congratulations! You have been approved as a <em>creator<em></p>
    <p>Log into your account now to upload videos about any catering subject that is of interest to you.</p>
    `
    };
};
exports.approvalEmail = approvalEmail;
const rejectionEmail = () => {
    return {
        subject: "Your creator profile has been rejected",
        body: `
    <p>Sorry! Your creator profile has been rejected</p>
    <p>Kindly contact the admin for more information</p>
    `
    };
};
exports.rejectionEmail = rejectionEmail;
