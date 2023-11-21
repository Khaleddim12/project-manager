"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidate = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const authValidate = (validationCase) => {
    switch (validationCase) {
        case "login":
            return [
                (0, express_validator_1.body)('username')
                    .notEmpty().withMessage((0, utils_1.errorMessages)("required", "username")),
                (0, express_validator_1.body)('password')
                    .notEmpty().withMessage((0, utils_1.errorMessages)("required", "password"))
                    .isLength({ min: 5 }).withMessage((0, utils_1.errorMessages)("minLength", "password", "5")),
            ];
        case "register":
            return [
                (0, express_validator_1.body)('username')
                    .notEmpty().withMessage((0, utils_1.errorMessages)("required", "username"))
                    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
                    // Check if the username is unique
                    const user = yield models_1.User.findOne({ username: value });
                    if (user) {
                        throw new Error((0, utils_1.errorMessages)("unique", "username"));
                    }
                })),
                (0, express_validator_1.body)('email')
                    .notEmpty().withMessage((0, utils_1.errorMessages)("required", "email"))
                    .isEmail().withMessage('Invalid email format')
                    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
                    // Check if the email is unique
                    const user = yield models_1.User.findOne({ email: value });
                    if (user) {
                        throw new Error('Email is already in use');
                    }
                })),
                (0, express_validator_1.body)('password')
                    .notEmpty().withMessage((0, utils_1.errorMessages)("required", "password"))
                    .isLength({ min: 5 }).withMessage((0, utils_1.errorMessages)("minLength", "password", "5")),
            ];
        case "forgot":
            return [
                (0, express_validator_1.body)("email").notEmpty().withMessage((0, utils_1.errorMessages)("required", "email"))
                    .isEmail().withMessage((0, utils_1.errorMessages)("email", "email"))
            ];
        case "reset":
            return [
                (0, express_validator_1.body)('password')
                    .notEmpty().withMessage((0, utils_1.errorMessages)("required", "password"))
                    .isLength({ min: 5 }).withMessage((0, utils_1.errorMessages)("minLength", "password", "5")),
            ];
        default:
            return [];
    }
};
exports.authValidate = authValidate;
