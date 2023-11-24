import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
        return next(HttpError(404, `Contact with id=${contactId} not found`))
    }
    next();
}