"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
// Routers
const routes_1 = require("./routes/");
// Middlewares
//import { authenticate } from "./middlewares";
const router = (0, express_1.Router)();
exports.router = router;
router.use("/auth", routes_1.authRouter);
