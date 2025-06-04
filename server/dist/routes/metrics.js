"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
const dataService_1 = require("../services/dataService");
const router = (0, express_1.Router)();
// Get metrics
router.get('/', (req, res) => {
    try {
        const metrics = (0, dataService_1.getMetrics)();
        res.json({ success: true, data: metrics });
    }
    catch (error) {
        logger_1.logger.error('Error fetching metrics:', error);
        throw new ApiError_1.ApiError('Failed to fetch metrics', 500, 'FETCH_METRICS_ERROR');
    }
});
exports.default = router;
