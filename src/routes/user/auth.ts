import { Router } from "express";


import { login, register } from "../../controllers/user/authController";

const authRouter = Router();

authRouter.route("/");

authRouter.route("/login").post(login);

authRouter.route("/register").post(register);

export { authRouter };