import { Request, Response, response } from 'express';
import { getRandom, hash, handleResponse, successResponse, successResponseFalse, validateEmail, randomId, errorResponse } from '../utils/modules';
import { User, OTP, Profile, Follow, Post, Reaction } from '../models/Models'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../services/email';
import { sign } from 'jsonwebtoken';
import config from '../config/configSetup'
import { OTPReason } from '../models/OTP';
import { passwordReset, registerEmail, verifyEmail, welcomeEmail } from '../utils/messages';
import { UserRole } from '../models/User';


export const register = async (req: Request, res: Response) => {
    let { email, phone, firstName, lastName, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return handleResponse(res, 400, false, 'Password does not match')
    }

    if (!validateEmail(email)) {
        return handleResponse(res, 400, false, 'Invalid email')
    }

    try {
        let oldUser = await User.findOne({ where: { email: email } });

        if (oldUser) {
            return handleResponse(res, 400, false, 'User already exists')
        }

        let hashPassword = await bcrypt.hash(password, 10);

        //user id
        const userId = `00${getRandom(7)}`;

        const user = await User.create({
            email,
            userId,
            phone,
            password: hashPassword,
            role: UserRole.USER
        })

        user.password = undefined;

        const profile = await Profile.create({
            firstName,
            lastName,
            userId: user.id
        })

        let otp = getRandom(6).toString();

        let otpExpires = new Date(Date.now() + config.OTP_EXPIRY_TIME * 60 * 1000);

        let otpRecord = await OTP.create({ email, otp, expiresAt: otpExpires })

        let emailSendStatus: boolean


        let messageId = await sendEmail(
            email,
            welcomeEmail(otp).subject,
            welcomeEmail(otp).body,
            profile.firstName
        )

        emailSendStatus = Boolean(messageId);

        return handleResponse(res, 200, true, 'User registered successfully', {
            user, emailSendStatus
        })
    } catch (error: any) {
        return handleResponse(res, 500, false, 'An error occurred', error)
    }
}


export const register2 = async (req: Request, res: Response) => {
    const { id, role } = req.user;

    const { otherNames, dateOfBirth, address, description, privacy, postCode, category } = req.body;

    if (!dateOfBirth || !address || !privacy || !postCode || !category)
        return handleResponse(res, 400, false, 'Please provide all required fields')


    try {
        let updated = await Profile.update({
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



        return handleResponse(res, 200, true, 'Profile updated successfully', updated)
    } catch (error: any) {
        return handleResponse(res, 500, false, error.message)
    }
}



export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    if (!email || !password) return handleResponse(res, 400, false, 'Please provide email and password')

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return handleResponse(res, 404, false, 'User not found')

        let passwordMatch = await bcrypt.compare(password, user.password || '')

        if (!passwordMatch) return handleResponse(res, 401, false, 'Invalid password')

        user.password = undefined;

        let token = sign({ id: user.id, email: user.email, role: user.role }, config.TOKEN_SECRET);

        return successResponse(res, 'Login successful', {
            user: user,
            token: token
        })
    } catch (error) {
        return errorResponse(res, 'error', error)
    }
}



export const verifyOTP = async (req: Request, res: Response) => {
    let { email, otp, reason } = req.body;

    let otpRecord = await OTP.findOne({ where: { email, otp } })

    if (!otpRecord) return handleResponse(res, 404, false, 'OTP not found')

    if (otpRecord.expiresAt < new Date()) {
        otpRecord.destroy();
        return handleResponse(res, 401, false, 'OTP expired')
    }

    if (reason === OTPReason.VERIFY_EMAIL) {
        let user = await User.findOne({ where: { email } })

        if (!user) return handleResponse(res, 404, false, 'User not found')

        user.emailVerified = true

        await user.save()
    }

    await otpRecord.destroy();

    return successResponse(res, 'OTP verified')
}



export const sendOTP = async (req: Request, res: Response) => {
    let { email, reason } = req.body;

    let user = await User.findOne({ where: { email } })

    if (!user) return handleResponse(res, 404, false, 'User not found')

    let otp = getRandom(6).toString();

    let otpExpires = new Date(Date.now() + config.OTP_EXPIRY_TIME * 60 * 1000);

    let otpRecord = await OTP.create({ email, otp, expiresAt: otpExpires })

    let emailSendStatus

    if (reason === OTPReason.FORGOT_PASSWORD) {
        let resetEmail = passwordReset(otp)

        let messageId = await sendEmail(
            email,
            resetEmail.subject,
            resetEmail.body,
            'User'
        )

        emailSendStatus = Boolean(messageId);
    } else if (reason === OTPReason.VERIFY_EMAIL) {
        let emailSent = verifyEmail(otp)

        let messageId = await sendEmail(
            email,
            emailSent.subject,
            emailSent.body,
            'User'
        )

        emailSendStatus = Boolean(messageId);
    }


    return successResponse(res, 'OTP sent', { emailSendStatus })
}

export const me = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['password'],
            },

            include: [{
                model: Profile,
                as: 'profile'
            }, {
                model: Post,
                as: 'posts',
            }, {
                model: User,
                as: 'followings',
            }, {
                model: User,
                as: 'followers',
            }]
        })

        return successResponse(res, 'success', user)
    } catch (error) {
        return errorResponse(res, 'error', error)
    }
}


