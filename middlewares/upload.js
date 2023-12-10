import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 159)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        cb(null, filename)
    }
})

const limits = {
    limitize: 5 * 1024 * 1024,
}

const fileFilter = (req, file, cb) => {
    const extention = file.originalname.split(".").pop();
    if (extention === "exe") {
        return cb(HttpError(400, "Invalid file extention"))
    }
    cb(null, true)
}

const upload = multer({
    storage,
    limits,
    fileFilter
})

export default upload;