import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../entities/admin";
const keys = require("../config/keys");

const secret = keys.jwtSecret;
// @route    POST /api/admin/signup
// @description     Create new admin

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

    const admin = Admin.create({
      full_name,
      email,
      password: hashedPassword,
    });
    await admin.save();
    const payload = {
      admin: {
        id: admin.id,
      },
    };

    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      message: "Account creation successful",
      status: "success",
      data: { admin, token },
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
