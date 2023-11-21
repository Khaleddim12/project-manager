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
exports.resetPassword = exports.forgotPassword = exports.register = exports.login = void 0;
// Middlewares
const middlewares_1 = require("../../middlewares");
// Services
const services_1 = require("../../services/");
const models_1 = require("../../models");
//error response
const utils_1 = require("../../utils");
const crypto_1 = __importDefault(require("crypto"));
// @desc    Login
// @route   POST /api/auth/login
exports.login = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    // Get user by email and password
    const user = yield models_1.User.findOne({ username }).select("+password");
    if (!user)
        return next(new utils_1.ErrorResponse(`username or/ and password are incorrect`, 400));
    const isMatch = yield user.matchPassword(password);
    if (!isMatch)
        return next(new utils_1.ErrorResponse(`username or/ and password are incorrect`, 400));
    const token = user.getSignedJwtToken();
    res.status(200).json({
        success: true,
        token,
    });
}));
// @desc: Register user
// @route: POST /api/auth/register
exports.register = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userBody = req.body;
    // Save user
    const user = yield (0, services_1.createUser)(userBody);
    res.status(201).json({
        success: true,
    });
}));
// @desc    Forget Password
// @route   POST /api/user/forgotpassword
exports.forgotPassword = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get user by mail
    const user = yield models_1.User.findOne({
        "email": req.body.email,
    });
    if (!user)
        return next(new utils_1.ErrorResponse((0, utils_1.errorMessages)("exist", "email"), 404));
    // get resetToken
    const resetToken = user.getResetPasswordToken();
    // Save hashed token
    yield user.save({ validateBeforeSave: false });
    const resetLink = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;
    try {
        // Send an email with a reset like to the user
        yield (0, utils_1.sendEmail)({
            email: user.email,
            subject: "Password reset token",
        }, resetLink);
    }
    catch (error) {
        console.log(`error ${error} `);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new utils_1.ErrorResponse("Email could not be sent", 500));
    }
    res.status(200).json({
        success: true,
        message: "email sent successfuly",
    });
}));
exports.resetPassword = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield models_1.User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new utils_1.ErrorResponse("Invalid token", 400));
    }
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Password Is Reset",
    });
}));
