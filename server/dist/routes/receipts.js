"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
const dataService_1 = require("../services/dataService");
const router = (0, express_1.Router)();
// Get all receipts
router.get('/', (req, res) => {
    try {
        const receipts = (0, dataService_1.getAllReceipts)();
        res.json({ success: true, data: receipts });
    }
    catch (error) {
        logger_1.logger.error('Error fetching receipts:', error);
        throw new ApiError_1.ApiError('Failed to fetch receipts', 500, 'FETCH_RECEIPTS_ERROR');
    }
});
exports.default = router;
