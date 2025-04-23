
// import { NextFunction, Request, Response } from 'express';
import multer from "multer";
const fs = require('fs')
const path = require('path')



const pathExistsOrCreate = (dirPath: string): string => {
    let filepath: string = path.resolve(__dirname, dirPath)
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true });
        console.log(`Directory created: ${filepath}`);
    }

    return filepath;
};



const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pathExistsOrCreate('../../public/uploads'))
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + "--" + file.originalname;
        cb(null, filename.replace(/\s+/g, ''))
    }
});




export const uploads = multer({
    storage: imageStorage,
})



