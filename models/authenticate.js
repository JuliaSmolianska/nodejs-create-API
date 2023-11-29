import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw HttpError(401, "Not authorized headers");
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        throw HttpError(401);
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        console.log(user)
        next();
    } catch (error) {
        throw HttpError(401, error.message);
    }
}

export default ctrlWrapper(authenticate);