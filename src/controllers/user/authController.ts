import { Request, Response, NextFunction } from "express";

// Middlewares
import { asyncHandler } from "../../middlewares";

// Services
import { createUser, findUserByCreds } from "../../services/";

// Utils
import { IUser } from "../../interfaces/userInterface";
import { User } from "../../models";
import { IAuthRequest, IResponse } from "../../interfaces";

//error response
import { ErrorResponse, errorMessages, sendEmail } from '../../utils'

import crypto from "crypto";


// @desc    Login
// @route   POST /api/auth/login
export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username;
        const password: string = req.body.password;

        // Get user by email and password
        const user = await User.findOne({ username }).select("+password");
        if (!user)
            return next(new ErrorResponse(`username or/ and password are incorrect`, 400))

        const isMatch = await user.matchPassword(password);

        if (!isMatch)
            return next(new ErrorResponse(`username or/ and password are incorrect`, 400))

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
        });
    }
);

// @desc: Register user
// @route: POST /api/auth/register
export const register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userBody = req.body as IUser;

        // Save user
        const user = await createUser(userBody);

        res.status(201).json({
            success: true,
        } as IResponse);
    }
);



// @desc    Forget Password
// @route   POST /api/user/forgotpassword
export const forgotPassword = asyncHandler(
    async (req: IAuthRequest, res: Response, next: NextFunction) => {

        //get user by mail
        const user = await User.findOne({
            "email": req.body.email,
        });

        if (!user)
            return next(new ErrorResponse(errorMessages("exist", "email"), 404));

        // get resetToken
        const resetToken = user.getResetPasswordToken();

        // Save hashed token
        await user.save({ validateBeforeSave: false });
        const resetLink = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

        try {
            // Send an email with a reset like to the user
            await sendEmail({
                email: user.email,
                subject: "Password reset token",
            }, resetLink);
        } catch (error) {
            console.log(`error ${error} `);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorResponse("Email could not be sent", 500));
        }
        res.status(200).json({
            success: true,
            message: "email sent successfuly",
        });
    }
);


export const resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const password = req.body.password;

        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid token", 400));
        }

        // Set new password
        user.password = password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Password Is Reset",
        });
    }
);