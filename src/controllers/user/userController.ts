import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Middleware
import { asyncHandler } from "../../middlewares";

//services
import { getUserBySlug, deleteUser } from "../../services";

//utils
import { errorMessages, ErrorResponse } from "../../utils";

//interfaces

import { IAuthRequest, IUser } from "../../interfaces";
import slugify from "slugify";
import { User } from "../../models";

// @desc    Get all users
// @route   GET /api/user
export const getUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const users = await User.find();
        // Send the retrieved users as the response
        res.status(200).json(users);
    }
);

// @desc    Get user by slug
// @route   GET /api/user/:slug
export const getBySlug = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const slug = req.params.slug;
        const user = await getUserBySlug(slug);

        //check if user is found or not
        if (!user)
            return next(new ErrorResponse(errorMessages("exist", "user"), 404));

        res.status(200).json({
            success: true,
            data: user,
        });
    }
);

// @desc    Eidt User Based On Slug
// @route   PUT /api/user/:slug


export const editUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const slug = req.params.slug;
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        let user = await getUserBySlug(slug);

        //check user availability
        if (!user)
            return next(new ErrorResponse(errorMessages("exist", "user"), 404));
        let nameSlug = "";
        if (!username) nameSlug = slug;
        else nameSlug = slugify(username, { lower: true });

        let updatedUser = await User.findOneAndUpdate(
            { slug: slug },
            {
                username: username,
                password: password,
                email: email,
                updatedAt: Date.now(),
                slug: nameSlug,
            },
            { new: true, upsert: false, projection: {} }
        );

        if (password) {
            updatedUser!.password = password;
        }
        updatedUser!.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User edited successfully",
            newpassword: password,
        });
    }
);

//* @desc Get profile of logged in User
//* @route GET /api/user
export const getProfile = asyncHandler(
    async (req: IAuthRequest, res: Response, next: NextFunction) => {
        const slug = req.user.slug;
        const user = await getUserBySlug(slug);

        if (!user)
            return next(
                new ErrorResponse(errorMessages("auth", "username/password"), 400)
            );

        res.status(200).json({
            success: true,
            data: user,
        });
    }
);

//* @desc Delete User By Slug
//* @route DELETE /api/user/:slug
export const deleteUserBySlug = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const slug = req.params.slug;

        // Get user by slug
        let user = await getUserBySlug(slug);
        if (!user)
            return next(new ErrorResponse(errorMessages("exist", "user"), 404));


        // Delete user account
        await deleteUser(user._id);

        //status return
        res.status(200).json({
            success: true,
            message: "user deleted successfuly",
        });


    }
);

//* @desc Delete User By Slug
//* @route DELETE /api/user/
export const deleteLoggedInUser = asyncHandler(
    async (req: IAuthRequest, res: Response, next: NextFunction) => {

        // Get user by id
        let user = await User.findOne({
            _id: req.user._id
        });
        if (!user)
            return next(new ErrorResponse(errorMessages("auth", "user"), 404));

        // Delete user account
        await deleteUser(user._id);

        //status return
        res.status(200).json({
            success: true,
            message: "user deleted successfuly",
        });
    }
);