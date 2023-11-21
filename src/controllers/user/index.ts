import {login, register, forgotPassword, resetPassword} from "./authController";
import {deleteLoggedInUser, deleteUserBySlug, editUser, getBySlug, getProfile, getUsers} from "./userController";

export {login, register, deleteLoggedInUser, deleteUserBySlug, editUser, getBySlug, getProfile, getUsers, forgotPassword, resetPassword}