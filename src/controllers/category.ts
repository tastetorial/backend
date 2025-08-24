import { Request, Response } from 'express';
import { Category } from '../models/Models';
import { errorResponse, successResponse } from '../utils/modules';
import { addCategorySchema, updateCategorySchema } from '../validation/body';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.findAll();

        return successResponse(res, 'success', categories);
    } catch (error) {
        return errorResponse(res, 'error', 'Internal server error');
    }
};

export const createCategory = async (req: Request, res: Response) => {
    const result = addCategorySchema.safeParse(req.body);

    if (!result.success) {
        return res.json({
            status: 'error',
            error: result.error.format()
        })
    }

    const { name, description, image } = result.data;

    try {
        const category = await Category.create({
            name,
            description,
            image
        });

        return successResponse(res, 'Category created successfully', category);
    } catch (error) {
        return errorResponse(res, 'error', 'Internal server error');
    }
}


export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = updateCategorySchema.safeParse(req.body);

    if (!result.success) {
        return res.json({
            status: 'error',
            error: result.error.format()
        })
    }

    try {
        const updated = await Category.update(result.data, {
            where: { id }
        })

        if (updated[0] === 0) {
            return res.json({
                status: 'error',
                error: 'Category not found'
            })
        }

        return successResponse(res, 'Category updated successfully', updated);
    } catch (error) {
        return errorResponse(res, 'error', 'Internal server error');
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleted = await Category.destroy({
            where: { id }
        });

        if (deleted === 0) {
            return res.json({
                status: 'error',
                error: 'Category not found'
            })
        }

        return successResponse(res, 'success', 'Category deleted successfully');
    } catch (error) {
        return errorResponse(res, 'error', 'Internal server error');
    }
};
