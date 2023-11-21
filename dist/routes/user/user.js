"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const middlewares_2 = require("../../middlewares");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.route("/").get(controllers_1.getUsers);
userRouter.route("/").delete(controllers_1.deleteLoggedInUser);
userRouter.route("/profile").get(controllers_1.getProfile);
userRouter.route("/logout").post(controllers_1.logout);
userRouter
    .route("/:slug")
    .get(controllers_1.getBySlug)
    .put((0, middlewares_1.userValidate)("edit"), middlewares_2.results, controllers_1.editUser)
    .delete(controllers_1.deleteUserBySlug);
