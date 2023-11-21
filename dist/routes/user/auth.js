"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const middlewares_2 = require("../../middlewares");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.route("/");
authRouter.route('/login').post((0, middlewares_1.authValidate)('login'), middlewares_2.results, controllers_1.login);
authRouter.route('/register').post((0, middlewares_1.authValidate)('register'), middlewares_2.results, controllers_1.register);
//request password reset
authRouter.route('/forgot-password').post((0, middlewares_1.authValidate)('forgot'), middlewares_2.results, controllers_1.forgotPassword);
//reset password
authRouter.route('/reset-password/:token').post((0, middlewares_1.authValidate)('reset'), middlewares_2.results, controllers_1.resetPassword);
