import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

export const formatResponse = (success, message, data = null) => {
    const response = { success, message };
    if (data) response.data = data;
    return response;
};

export const paginateResults = (page = 1, limit = 10) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    return { skip, limit: limitNum, page: pageNum };
};
