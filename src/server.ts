import express from "express";
import colors from "colors"
// ENVIRONMENT VARIABLES
import dotenv from "dotenv";

// DB
import { connectDB } from "./config/database";

//router
import {router} from './routes'

// PATH
import path from "path";

//Error Handler
import {error} from './middlewares'

const app = express();

// Server
const httpServer = require("http").Server(app);

dotenv.config({ path: "src/config/.env" });

// Connect to the DB
connectDB();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", router);

//use error handler
app.use(error);

// Listen
const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
    console.log(
        colors.yellow.bold(
            `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
        )
    );
});


// Handle unhandled promise rejection
process.on("unhandledRejection", (err: Error, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});

// Catch un caught exceptions
process.on("uncaughtException", (err: Error) => {
    console.log(`Error ${err.message}`);
    server.close(() => process.exit(1));
});