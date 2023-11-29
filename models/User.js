import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const userSchema = new Schema({
    password: {
        type: String,
        minLenth: 8,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        match: emailPattern,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
    },
},
    { versionKey: false, timestamps: true }
)

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const User = model("user", userSchema);

export const userRegisterSchema = Joi.object({
    password: Joi.string().min(8).required().messages({ "any.required": `"password" is a required field` }),
    email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" is a required field` }),
    subscription: Joi.string(),
})

export const userLoginSchema = Joi.object({
    password: Joi.string().min(8).required().messages({ "any.required": `"password" is a required field` }),
    email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" is a required field` }),
})

export const userUpdateSubcsriptionSchema = Joi.object({
    subscription: Joi.string()
        .valid('starter', 'pro', 'business')
        .required()
        .messages({ "any.required": `"subscription" is a required field` }),
});

