import express from "express";
import authController from "../../controllers/auth_controller.js"
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { validateBody } from "../../decorator/validateBody.js";
import {
  userRegisterSchema,
  userEmailSchema,
  userLoginSchema,
  userUpdateSubcsriptionSchema
} from "../../models/User.js"
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userRegisterSchema), authController.register);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyBody, validateBody(userEmailSchema), authController.resendVarify)

authRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), authController.login)

authRouter.get("/current", authenticate, authController.current);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/", isEmptyBody, authenticate, validateBody(userUpdateSubcsriptionSchema), authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), authController.updateAvatar);

export default authRouter;