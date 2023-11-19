import { Router } from "express";

// Routers
import { authRouter, } from "./routes/";

// Middlewares
//import { authenticate } from "./middlewares";

const router = Router();

router.use("/auth", authRouter);

export { router };