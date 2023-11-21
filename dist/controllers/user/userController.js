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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.deleteLoggedInUser = exports.deleteUserBySlug = exports.getProfile = exports.editUser = exports.getBySlug = exports.getUsers = void 0;
// Middleware
const middlewares_1 = require("../../middlewares");
//services
const services_1 = require("../../services");
//utils
const utils_1 = require("../../utils");
const slugify_1 = __importDefault(require("slugify"));
const models_1 = require("../../models");
// @desc    Get all users
// @route   GET /api/user
exports.getUsers = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.find();
    // Send the retrieved users as the response
    res.status(200).json(users);
}));
// @desc    Get user by slug
// @route   GET /api/user/:slug
exports.getBySlug = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const user = yield (0, services_1.getUserBySlug)(slug);
    //check if user is found or not
    if (!user)
        return next(new utils_1.ErrorResponse((0, utils_1.errorMessages)("exist", "user"), 404));
    res.status(200).json({
        success: true,
        data: user,
    });
}));
// @desc    Eidt User Based On Slug
// @route   PUT /api/user/:slug
exports.editUser = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    let user = yield (0, services_1.getUserBySlug)(slug);
    //check user availability
    if (!user)
        return next(new utils_1.ErrorResponse((0, utils_1.errorMessages)("exist", "user"), 404));
    let nameSlug = "";
    if (!username)
        nameSlug = slug;
    else
        nameSlug = (0, slugify_1.default)(username, { lower: true });
    let updatedUser = yield models_1.User.findOneAndUpdate({ slug: slug }, {
        username: username,
        password: password,
        email: email,
        updatedAt: Date.now(),
        slug: nameSlug,
    }, { new: true, upsert: false, projection: {} });
    if (password) {
        updatedUser.password = password;
    }
    updatedUser.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User edited successfully",
        newpassword: password,
    });
}));
//* @desc Get profile of logged in User
//* @route GET /api/user
exports.getProfile = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.user.slug;
    const user = yield (0, services_1.getUserBySlug)(slug);
    if (!user)
        return next(new utils_1.ErrorResponse((0, utils_1.errorMessages)("auth", "username/password"), 400));
    res.status(200).json({
        success: true,
        data: user,
    });
}));
//* @desc Delete User By Slug
//* @route DELETE /api/user/:slug
exports.deleteUserBySlug = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    // Get user by slug
    let user = yield (0, services_1.getUserBySlug)(slug);
    if (!user)
        return next(new utils_1.ErrorResponse((0, utils_1.errorMessages)("exist", "user"), 404));
    // Delete user account
    yield (0, services_1.deleteUser)(user._id);
    //status return
    res.status(200).json({
        success: true,
        message: "user deleted successfuly",
    });
}));
//* @desc Delete User By Slug
//* @route DELETE /api/user/
exports.deleteLoggedInUser = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user by id
    let user = yield models_1.User.findOne({
        _id: req.user._id
    });
    if (!user)
        return next(new utils_1.ErrorResponse((0, utils_1.errorMessages)("auth", "user"), 404));
    // Delete user account
    yield (0, services_1.deleteUser)(user._id);
    //status return
    res.status(200).json({
        success: true,
        message: "user deleted successfuly",
    });
}));
exports.logout = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "user logged out"
    });
}));
