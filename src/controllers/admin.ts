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
    const adminExists = await Admin.find({ where: [{ email }] });

    if (adminExists) {
      return res.status(400).json({
        message: "Email belong to another admin",
        status: "error",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = Admin.create({
      full_name,
      email: email.toLowerCase(),
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
      data: {
        admin: { full_name: admin.full_name, email: admin.email },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      status: "error",
      data: null,
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  // check if admin inputs email or password
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please enter valid credentials",
      data: null,
    });
  }
  try {
    email = email.toLowerCase();
    const adminExist = await Admin.find({ where: [{ email }] }); // check if admin exist

    if (!adminExist) {
      return res.status(404).json({
        status: "error",
        message: "admin does not exist! Please check your signin details",
        data: null,
      });
    }
    // extracting relevant inforUation from admin database
    const admin_password = adminExist[0].password;
    const admin_id = adminExist[0].id;

    const passwordMatch = await bcrypt.compare(password, admin_password); // returns true or false
    if (passwordMatch) {
      // defining the contents of the payload
      const payload = {
        admin: {
          id: admin_id,
        },
      };
      // signing the token
      const token = jwt.sign(payload, secret);

      return res.status(200).json({
        message: "Login successful",
        status: "success",
        data: {
          admin: {
            full_name: adminExist[0].full_name,
            email: adminExist[0].email,
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
