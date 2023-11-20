import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from "express"

export const results = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    // If there are no validation errors, proceed to the next middleware or route handler
    next();
};
