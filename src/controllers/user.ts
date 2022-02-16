import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/user";
const keys = require("../config/keys");

const secret = keys.jwtSecret;
// @route    POST /api/user/signup
// @description     Create new user

export const signUp = async (req: Request, res: Response) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(422).json({
      message: "Full name, email and password are required",
      status: "error",
      data: null,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create({
      full_name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      message: "Account creation successful",
      status: "success",
      data: { user, token },
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Account creation failed",
      status: "error",
      data: null,
    });
  }
};
