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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const Models_1 = require("../models/Models");
const modules_1 = require("../utils/modules");
const body_1 = require("../validation/body");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Models_1.Category.findAll();
        return (0, modules_1.successResponse)(res, 'success', categories);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.getCategories = getCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = body_1.addCategorySchema.safeParse(req.body);
    if (!result.success) {
        return res.json({
            status: 'error',
            error: result.error.format()
        });
    }
    const { name, description, image } = result.data;
    try {
        const category = yield Models_1.Category.create({
            name,
            description,
            image
        });
        return (0, modules_1.successResponse)(res, 'Category created successfully', category);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = body_1.updateCategorySchema.safeParse(req.body);
    if (!result.success) {
        return res.json({
            status: 'error',
            error: result.error.format()
        });
    }
    try {
        const updated = yield Models_1.Category.update(result.data, {
            where: { id }
        });
        if (updated[0] === 0) {
            return res.json({
                status: 'error',
                error: 'Category not found'
            });
        }
        return (0, modules_1.successResponse)(res, 'Category updated successfully', updated);
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleted = yield Models_1.Category.destroy({
            where: { id }
        });
        if (deleted === 0) {
            return res.json({
                status: 'error',
                error: 'Category not found'
            });
        }
        return (0, modules_1.successResponse)(res, 'success', 'Category deleted successfully');
    }
    catch (error) {
        return (0, modules_1.errorResponse)(res, 'error', 'Internal server error');
    }
});
exports.deleteCategory = deleteCategory;
