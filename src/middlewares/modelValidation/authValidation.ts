import { body } from 'express-validator';
import { errorMessages } from '../../utils'
import {User} from '../../models'

export const authValidate = (validationCase: "login" | "register") => {
    switch (validationCase) {
        case "login":
            return [
                body('username')
                    .notEmpty().withMessage(errorMessages("required", "username")),

                body('password')
                    .notEmpty().withMessage(errorMessages("required", "password"))
                    .isLength({ min: 5 }).withMessage(errorMessages("minLength","password","5")),
            ];
        
        case "register":
            return [
                body('username')
                .notEmpty().withMessage(errorMessages("required", "username"))
                .custom(async (value) => {
                    // Check if the username is unique
                    const user = await User.findOne({ username: value });
                    if (user) {
                        throw new Error(errorMessages("unique", "username"));
                    }
                }),
                
                body('email')
                .notEmpty().withMessage(errorMessages("required", "email"))
                .isEmail().withMessage('Invalid email format')
                .custom(async (value) => {
                    // Check if the email is unique
                    const user = await User.findOne({ email: value });
                    if (user) {
                        throw new Error('Email is already in use');
                    }
                }),

                body('password')
                    .notEmpty().withMessage(errorMessages("required", "password"))
                    .isLength({ min: 5 }).withMessage(errorMessages("minLength","password","5")),
            ];
    }
}

