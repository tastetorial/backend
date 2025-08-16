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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const modules_1 = require("../utils/modules");
const uploadCloud_1 = require("../utils/uploadCloud");
const uuid_1 = require("uuid");
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return (0, modules_1.handleResponse)(res, 404, false, 'No file uploaded');
    }
    const file = req.file;
    const fileModified = {
        buffer: file.buffer,
        name: (0, uuid_1.v4)() + '.' + file.mimetype.split('/')[1],
        mimetype: file.mimetype,
    };
    console.log('filename', fileModified.name);
    try {
        const path = yield (0, uploadCloud_1.uploadFileToBlob)(file.fieldname, fileModified);
        return (0, modules_1.successResponse)(res, 'success', { url: path });
    }
    catch (error) {
        return (0, modules_1.handleResponse)(res, 500, false, 'Error uploading file');
    }
});
exports.uploadFile = uploadFile;
