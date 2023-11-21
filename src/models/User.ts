import mongoose, { Schema, Document, model } from "mongoose"
import { IUser } from '../interfaces'
import bcrypt from "bcrypt";
import slugify from "slugify";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const UserSchema = new Schema<IUser>({
    username: String,
    slug: String,
    password: {
        type: String,
        select: false
    },


    email: {
        type: String,
    },

    resetPasswordToken: String,
    resetPasswordExpire: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date(),
    },
    updatedAt: Date,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
});

UserSchema.path('username').validate(async function (value: string) {
    let count: number = await mongoose.models["User"].findOne({ "username": value }).countDocuments();

    if (count > 0) {
        return false
    }
    else {
        return true
    }
}, 'A user with same user name already exists');

UserSchema.path('email').validate(async function (value: string) {
    let count: number = await mongoose.models["User"].findOne({ "email": value }).countDocuments();

    if (count > 0) {
        return false
    }
    else {
        return true
    }
}, 'A user with same email already exists');

// Hash the password before saving to the database
UserSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    }
    // Setting up date and slug
    this.updatedAt = new Date();
    this.slug = slugify(this.username, { lower: true });
    next();
});


/*** Static methods ***/
// Get jwt token
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//compare entered password against password hash
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to reset password token field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 3600000;

    return resetToken;
};


const User = model<IUser>("User", UserSchema);
export { User, UserSchema };