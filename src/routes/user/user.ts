import { Router } from "express";
import { deleteLoggedInUser, deleteUserBySlug, editUser, getBySlug, getProfile, getUsers } from "../../controllers";
import { userValidate } from '../../middlewares'
import { results } from '../../middlewares'

const userRouter = Router();

userRouter.route("/").get(getUsers);
userRouter.route("/").delete(deleteLoggedInUser)
userRouter.route("/profile").get(getProfile);

userRouter
    .route("/:slug")
    .get(getBySlug)
    .put(userValidate("edit"), results, editUser)
    .delete(deleteUserBySlug);

export { userRouter };