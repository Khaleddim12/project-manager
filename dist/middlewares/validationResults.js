"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
const express_validator_1 = require("express-validator");
const results = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    // If there are no validation errors, proceed to the next middleware or route handler
    next();
};
exports.results = results;
