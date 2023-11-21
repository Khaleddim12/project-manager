"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.errorMessages = exports.errorData = exports.ErrorResponse = void 0;
const error_1 = require("./error/");
Object.defineProperty(exports, "ErrorResponse", { enumerable: true, get: function () { return error_1.ErrorResponse; } });
Object.defineProperty(exports, "errorData", { enumerable: true, get: function () { return error_1.errorData; } });
Object.defineProperty(exports, "errorMessages", { enumerable: true, get: function () { return error_1.errorMessages; } });
const mail_1 = __importDefault(require("./mail"));
exports.sendEmail = mail_1.default;
