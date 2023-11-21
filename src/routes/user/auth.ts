import { Router } from "express";
import { login, register, forgotPassword, resetPassword } from "../../controllers";
import {authValidate} from '../../middlewares'
import {results} from '../../middlewares'

const authRouter = Router();

authRouter.route("/");

authRouter.route('/login').post(authValidate('login'),results, login);
authRouter.route('/register').post(authValidate('register'),results, register);

//request password reset
authRouter.route('/forgot-password').post(authValidate('forgot'), results, forgotPassword)

//reset password

authRouter.route('/reset-password/:token').post(authValidate('reset'), results, resetPassword)

export { authRouter };