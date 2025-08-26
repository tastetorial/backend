import { Request, Response, response } from 'express';
import { getRandom, hash, handleResponse, successResponse, successResponseFalse, validateEmail, randomId, errorResponse } from '../utils/modules';
import { User, OTP, Follow, Reaction, Video, Creator } from '../models/Models'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../services/email';
import { sign } from 'jsonwebtoken';
import config from '../config/configSetup'
import { CreatorStatus, OTPReason } from '../enum';
import { passwordReset, verifyEmail, welcomeEmail, welcomeEmail2 } from '../utils/messages';
import { UserRole } from '../enum';
import { changePasswordSchema, loginSchema, registerSchema, resetPasswordSchema, updateProfileSchema, verifyOTPSchema } from '../validation/body';
import { Op } from 'sequelize';
import crypto from "crypto";


export const register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success)
        return res.status(400).json({
            error: "Invalid input",
            issues: result.error.format()
        })


    let { email, phone, firstname, lastname, password, confirmPassword } = result.data;

    if (password !== confirmPassword) {
        return handleResponse(res, 400, false, 'Password does not match')
    }

    if (!validateEmail(email)) {
        return handleResponse(res, 400, false, 'Invalid email')
    }

    try {
        let oldUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (oldUser) {
            return handleResponse(res, 400, false, 'User already exists')
        }

        let hashPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            email,
            phone,
            firstname: firstname,
            username: firstname + randomId(6),
            lastname: lastname,
            password: hashPassword,
            role: UserRole.VIEWER
        })

        user.password = undefined;


        let otp = crypto.randomBytes(32).toString("hex");

        let otpExpires = new Date(Date.now() + config.OTP_EXPIRY_TIME * 60 * 1000);

        let otpRecord = await OTP.create({ email, otp, expiresAt: otpExpires })

        const activationLink = `${config.CLIENT_URL}/auth_screen2.html?token=${otp}`;

        let emailSendStatus: boolean

        let emailToSend = welcomeEmail2(activationLink);

        let messageId = await sendEmail(
            email,
            emailToSend.subject,
            emailToSend.body,
            user.firstname
        )

        emailSendStatus = Boolean(messageId);

        return handleResponse(res, 200, true, 'User registered successfully', {
            user, emailSendStatus
        })
    } catch (error: any) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal server error')
    }
}


export const activateAccount = async (req: Request, res: Response) => {
    const { token } = req.query;

    try {
        const otp = await OTP.findOne({
            where: {
                otp: token,
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!otp) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const user = await User.findOne({
            where: {
                email: otp.email
            }
        })

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.emailVerified = true;

        await user.save();

        return successResponse(res, 'success', 'Account activated successfully');
    } catch (err) {
        return errorResponse(res, 'error', 'Internal server error');
    }
};



export const login = async (req: Request, res: Response) => {
    let result = loginSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    let { email, password } = result.data;

    try {
        let user = await User.findOne({
            where: { email },
            include: [Creator]
        })

        if (!user) return handleResponse(res, 404, false, 'User not found')

        let passwordMatch = await bcrypt.compare(password, user.password || '')

        if (!passwordMatch) return handleResponse(res, 401, false, 'Invalid password')

        user.password = undefined;

        if (!user.emailVerified) return handleResponse(res, 401, false, 'Please verify your email')

        let token = sign({ id: user.id, email: user.email, role: user.role }, config.TOKEN_SECRET);

        return successResponse(res, 'Login successful', {
            user: user,
            token: token
        })
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', error)
    }
}


export const updateProfile = async (req: Request, res: Response) => {
    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    try {
        const updated = await User.update(result.data, {
            where: { id: req.user.id }
        })

        return successResponse(res, 'Profile updated successfully', {

        })
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', error)
    }
}


export const changePassword = async (req: Request, res: Response) => {
    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    const { oldPassword, newPassword } = result.data

    try {
        const user = await User.findOne({
            where: { id: req.user.id }
        })
        if (!user) {
            return handleResponse(res, 404, false, 'User not found')
        }

        const match = await bcrypt.compare(oldPassword, user.password || '')

        if (!match) {
            return handleResponse(res, 400, false, 'Old password does not match')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const updated = await User.update({ password: hashedPassword }, {
            where: { id: req.user.id }
        })

        return successResponse(res, 'Password changed successfully')
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', error)
    }
}


export const resetPassword = async (req: Request, res: Response) => {
    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }

    const { email, newPassword } = result.data

    try {
        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            return handleResponse(res, 404, false, 'User not found')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const updated = await User.update(
            { password: hashedPassword },
            {
                where: { id: user.id }
            })

        return successResponse(res, 'Password reset successfully')
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', error)
    }
}



export const verifyOTP = async (req: Request, res: Response) => {
    const result = verifyOTPSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }


    let { email, otp, reason } = result.data;

    try {
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
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', error)
    }
}



export const sendOTP = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'Error sending OTP', error)
    }
}


export const me = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['password'],
            },

            include: [{
                model: Video,
                as: 'videos',
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


