import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET_KEY, BASE_URL } = process.env;

const verifyEmail = ({email, verificationToken}) =>({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
});

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const avatarURL = gravatar.url(email);

  if (user) {
    throw HttpError(409, "Email already use")
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  await sendEmail(verifyEmail({ email, verificationToken }));

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    }
  });
}

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found")
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
  res.json({ message: "Verification successful" });
}

const resendVarify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found")
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed")
  }

  await sendEmail(verifyEmail({ email, verificationToken: user.verificationToken }));
  res.json({ message: "Verification email sent" });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong")
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify")
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Password is wrong")
  }
  const payload = {
    id: user._id
  }

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "48h",
  });
  await User.findByIdAndUpdate(user._id, { token })

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
}

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription
  })
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" })
  res.status(204).json({ message: "No Content" })
}

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  const updateSubscription = await User.findByIdAndUpdate(_id, { subscription })
  if (!updateSubscription) {
    throw HttpError(404, `User not found`);
  }
  res.json({
    email: updateSubscription.email,
    subscription: updateSubscription.subscription
  })
}

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  if (!req.file) {
    throw new Error("No file provided for avatar update.");
  }
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  (await jimp.read(oldPath)).resize(250, 250).write(oldPath);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVarify: ctrlWrapper(resendVarify),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar)
};