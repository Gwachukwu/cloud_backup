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
    const userExists = await User.find({ where: [{ email }] });

    if (userExists) {
      return res.status(400).json({
        message: "Email belong to another admin",
        status: "error",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create({
      full_name,
      email: email.toLowerCase(),
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
      data: { user: { full_name: user.full_name, email: user.email }, token },
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

export const signIn = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  // check if user inputs email or password
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please enter valid credentials",
      data: null,
    });
  }
  try {
    email = email.toLowerCase();
    let userExist = await User.find({ where: [{ email }] }); // check if user exist

    if (!userExist) {
      return res.status(404).json({
        status: "error",
        message: "User does not exist! Please check your signin details",
        data: null,
      });
    }
    // extracting relevant inforUation from user database
    const user_password = userExist[0].password;
    const user_id = userExist[0].id;

    const passwordMatch = await bcrypt.compare(password, user_password); // returns true or false
    if (passwordMatch) {
      // defining the contents of the payload
      const payload = {
        user: {
          id: user_id,
        },
      };
      // signing the token
      const token = jwt.sign(payload, secret);

      return res.status(200).json({
        message: "Login successful",
        status: "success",
        data: {
          user: {
            full_name: userExist[0].full_name,
            email: userExist[0].email,
          },
          token,
        },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Incorrect Credentials",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Something went wrong",
      status: "error",
      data: null,
    });
  }
};
