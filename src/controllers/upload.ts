import { Request, Response } from "express"
import { handleResponse, successResponse } from "../utils/modules"
import { uploadFileToBlob, uploadFilesToBlob } from "../utils/uploadCloud";
import { v4 as uuidv4 } from 'uuid';


export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return handleResponse(res, 404, false, 'No file uploaded');
    }

    const file = req.file as Express.Multer.File;

    const fileModified = {
        buffer: file.buffer,
        name: uuidv4() + '.' + file.mimetype.split('/')[1],
        mimetype: file.mimetype,
    }

    console.log('filename', fileModified.name);

    try {
        const path = await uploadFileToBlob(file.fieldname, fileModified)

        return successResponse(res, 'success', { url: path })
    } catch (error) {
        return handleResponse(res, 500, false, 'Error uploading file');
    }
}



