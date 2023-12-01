import express from "express";
import authController from "../../controllers/auth_controller.js"
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { validateBody } from "../../decorator/validateBody.js";
import { userRegisterSchema, userLoginSchema, userUpdateSubcsriptionSchema } from "../../models/User.js"
import authenticate from "../../models/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userRegisterSchema), authController.register);

authRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), authController.login)

authRouter.get("/current", authenticate, authController.current);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/", isEmptyBody, authenticate, validateBody(userUpdateSubcsriptionSchema), authController.updateSubscription);

export default authRouter;