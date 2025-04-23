import { Request, Response } from "express"
import { handleResponse, successResponse } from "../utils/modules"

const BASE_FOLDER = 'uploads'

export const uploadFiles = async (req: Request, res: Response) => {
    if (!req.files) {
        return handleResponse(res, 404, false, 'No files uploaded');
    }

    const files = req.files as Express.Multer.File[];

    const paths = files.map((file: any) => {
        return `/${BASE_FOLDER}/${file.filename}`
    });

    return successResponse(res, 'success', { urls: paths });
}

export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return handleResponse(res, 404, false, 'No file uploaded');
    }

    return successResponse(res, 'success', { url: `/${BASE_FOLDER}/${req.file.filename}` })
}



export const upload = async (req: Request, res: Response) => {
    if (!req.file) {
        return handleResponse(res, 404, false, 'No file uploaded');
    }

    // const url = await upload_cloud(filePath);

    return successResponse(res, "Successful", { url: `/${BASE_FOLDER}/${req.file.filename}` })
}