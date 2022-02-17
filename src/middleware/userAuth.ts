import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config();

interface ReqExtended extends Request {
  user: { id: string };
}

module.exports = function (
  req: ReqExtended,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "unauthorized", status: "error", data: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    if (req.user) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "unauthorized", status: "error", data: null });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "unauthorized", status: "error", data: null });
  }
};
