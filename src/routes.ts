import { Router } from "express";

// Routers
import { authRouter,userRouter } from "./routes/";

// Middlewares
import { authenticate } from "./middlewares";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", authenticate,userRouter);

export { router };