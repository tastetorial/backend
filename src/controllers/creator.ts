import { Response, Request } from "express";
import { creatorSchema } from "../validation/body";
import { errorResponse, handleResponse, successResponse } from "../utils/modules";
import { Creator, User, Video } from "../models/Models";
import { CreatorStatus, UserRole } from "../enum";
import { getCreatorQuerySchema } from "../validation/query";
import { Op } from "sequelize";
import { approvalEmail, rejectionEmail } from "../utils/messages";
import { sendEmail } from "../services/email";

export const upgradeToCreator = async (req: Request, res: Response) => {
    const { id } = req.user;

    const result = creatorSchema.safeParse(req.body);

    if (!result.success)
        return res.status(400).json({
            error: "Invalid input",
            issues: result.error.format()
        })

    const { bio } = result.data;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return handleResponse(res, 404, false, 'User not found')
        }

        if (user.role !== UserRole.VIEWER) {
            return handleResponse(res, 400, false, 'You must be a viewer to upgrade to a creator')
        }

        const creator = await Creator.create({
            userId: id,
            bio,
            status: CreatorStatus.PENDING
        })


        return successResponse(res, 'success', 'Creator account created successfully, please wait for approval')
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'An error occurred')
    }
}

export const approveCreator = async (req: Request, res: Response) => {
    const { creatorId } = req.params;

    try {
        const creator = await Creator.findByPk(creatorId, {
            include: [User]
        });

        if (!creator) {
            return handleResponse(res, 404, false, 'Creator not found')
        }

        if (creator.status !== CreatorStatus.PENDING) {
            return handleResponse(res, 400, false, 'Creator account already approved/declined')
        }

        creator.status = CreatorStatus.APPROVED;

        await creator.save();

        creator.user.role = UserRole.CREATOR;

        await creator.user.save();

        let emailToSend = approvalEmail()

        let messageId = await sendEmail(
            creator.user.email,
            emailToSend.subject,
            emailToSend.body,
            creator.user.firstname
        )

        let emailSendStatus = Boolean(messageId);

        return successResponse(res, 'success', {
            message: 'Creator account approved successfully',
            emailSendStatus
        })
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'An error occurred')
    }
}


export const rejectCreator = async (req: Request, res: Response) => {
    const { creatorId } = req.params;

    try {
        const creator = await Creator.findByPk(creatorId, {
            include: [User]
        });

        if (!creator) {
            return handleResponse(res, 404, false, 'Creator not found')
        }

        if (creator.status !== CreatorStatus.PENDING) {
            return handleResponse(res, 400, false, 'Creator account already approved/declined')
        }

        creator.status = CreatorStatus.DECLINED;

        await creator.save();

        let emailToSend = rejectionEmail()

        let messageId = await sendEmail(
            creator.user.email,
            emailToSend.subject,
            emailToSend.body,
            creator.user.firstname
        )

        let emailSendStatus = Boolean(messageId);

        return successResponse(res, 'success', {
            message: 'Creator account rejected successfully',
            emailSendStatus
        })
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'An error occurred')
    }
}


export const getCreators = async (req: Request, res: Response) => {
    const result = getCreatorQuerySchema.safeParse(req.query);

    if (!result.success)
        return res.status(400).json({
            error: "Invalid input",
            issues: result.error.format()
        })

    const { page, limit, status, search } = result.data;

    try {
        const creators = await Creator.findAll({
            where: {
                ...(status && { status }),
            },
            include: [
                {
                    model: User,
                    as: 'user',     // 👈 important alias
                    attributes: { exclude: ['password', 'deviceToken'] },
                    where: search
                        ? {
                            [Op.or]: [
                                { firstname: { [Op.like]: `%${search}%` } },
                                { lastname: { [Op.like]: `%${search}%` } },
                                { username: { [Op.like]: `%${search}%` } },
                                { email: { [Op.like]: `%${search}%` } },
                            ],
                        }
                        : undefined, // 👈 don’t apply WHERE if search is empty
                },
            ],
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });


        return successResponse(res, 'success', creators)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal server error')
    }
}


export const getCreator = async (req: Request, res: Response) => {
    const { creatorId } = req.params

    try {
        const creator = await Creator.findByPk(creatorId, {
            include: [{
                model: User,
                attributes: { exclude: ['password', 'deviceToken'] },
                include: [Video]
            }]
        })

        return successResponse(res, 'success', creator)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 'error', 'Internal server error')
    }
}