import { Router } from "express";
import { login, register } from "../../controllers/user/authController";
import {authValidate} from '../../middlewares'
import {results} from '../../middlewares'

const authRouter = Router();

authRouter.route("/");

authRouter.route('/login').post(authValidate('login'),results, login);
authRouter.route('/register').post(authValidate('register'),results, register);

export { authRouter };