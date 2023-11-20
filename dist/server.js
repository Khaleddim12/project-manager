"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colors_1 = __importDefault(require("colors"));
// ENVIRONMENT VARIABLES
const dotenv_1 = __importDefault(require("dotenv"));
// DB
const database_1 = require("./config/database");
//router
const routes_1 = require("./routes");
// PATH
const path_1 = __importDefault(require("path"));
//Error Handler
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
// Server
const httpServer = require("http").Server(app);
dotenv_1.default.config({ path: "src/config/.env" });
// Connect to the DB
(0, database_1.connectDB)();
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static folder
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Routes
app.use("/api", routes_1.router);
//use error handler
app.use(middlewares_1.error);
// Listen
const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
    console.log(colors_1.default.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
});
// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});
// Catch un caught exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error ${err.message}`);
    server.close(() => process.exit(1));
});
