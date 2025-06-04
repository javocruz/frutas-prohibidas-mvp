"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    if ('statusCode' in err) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                code: err.code,
            },
        });
    }
    return res.status(500).json({
        success: false,
        error: {
            message: 'Internal Server Error',
            code: 'INTERNAL_ERROR',
        },
    });
};
exports.errorHandler = errorHandler;
