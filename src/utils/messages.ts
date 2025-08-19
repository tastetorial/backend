import config from "../config/configSetup"
import { getDate } from "./modules"

interface Message {
    subject: string,
    body: string
}

interface Notification {
    title: string,
    body: string
}

export const passwordReset = (otp: string): Message => {
    return {
        subject: "Password Reset",
        body: `
    <p>We have received a request to reset your password. Use the OTP below to reset your password.</p>
    <h1 style="text-align: center">${otp}</h1>
    <p>Note that this OTP expires in ${config.OTP_EXPIRY_TIME} minutes</p>
    `
    }
}


export const verifyEmail = (otp: string): Message => {
    return {
        subject: "Verify your email",
        body: `
    <p>We have received a request to verify your email. Use the OTP below to verify your email.</p>
   <h1 style="text-align: center">${otp}</h1>
    <p>Note that this OTP expires in ${config.OTP_EXPIRY_TIME} minutes</p>
    `
    }
}

export const welcomeEmail = (otp: string): Message => {
    return {
        subject: "Welcome to Tastetorial",
        body: `
    <p>You are welcome to Tastetorial App</p>
    <p>Use this OTP to verify our account</p>
    <h1 style="text-align: center">${otp}</h1>
    `
    }
}

export const approvalEmail = (): Message => {
    return {
        subject: "Your creator profile has been approved",
        body: `
    <p>Congratulations! You have been approved as a <em>creator<em></p>
    <p>Log into your account now to upload videos about any catering subject that is of interest to you.</p>
    `
    }
}


export const rejectionEmail = (): Message => {
    return {
        subject: "Your creator profile has been rejected",
        body: `
    <p>Sorry! Your creator profile has been rejected</p>
    <p>Kindly contact the admin for more information</p>
    `
    }
}
