import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { preUpdate } from "../models/hooks.js";

const { JWT_SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already use")
  }
  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong")
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "password is wrong")
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

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription)
};