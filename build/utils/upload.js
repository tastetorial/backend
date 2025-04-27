"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// const fs = require('fs')
// const path = require('path')
// const pathExistsOrCreate = (dirPath: string): string => {
//     let filepath: string = path.resolve(__dirname, dirPath)
//     if (!fs.existsSync(filepath)) {
//         fs.mkdirSync(filepath, { recursive: true });
//         console.log(`Directory created: ${filepath}`);
//     }
//     return filepath;
// };
// const imageStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, pathExistsOrCreate('../../public/uploads'))
//     },
//     filename: (req, file, cb) => {
//         let filename = Date.now() + "--" + file.originalname;
//         cb(null, filename.replace(/\s+/g, ''))
//     }
// });
// export const uploads = multer({
//     storage: imageStorage,
// })
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
