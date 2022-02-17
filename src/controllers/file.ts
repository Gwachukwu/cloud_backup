import { Request, Response } from "express";
import { File } from "../entities/file";
const cloudinary = require("../config/cloudinary");

exports.uploadBrief = async (req: any, res: Response) => {
  let file = req.file;

  // destructuring data coming from the user
  const { folder } = req.body;

  if (!file) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Please upload a file to be translated",
        data: null,
      });
  }

  if (file.size > 200000000) {
    return res.status(400).json({
      status: 400,
      message: "Please upload a file not more than 200mb",
    });
  }

  try {
    const path = req.file?.path;
    const filename = req.file?.filename;

    // upload file to cloudinary
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "auto",
        public_id: `prodigee/brief/${filename}`,
        overwrite: true,
        notification_url: "http://127.0.0.1:3000/file/auto",
      },
      async function (error: any, result: any) {
        if (error) {
          console.log("upload error:", error);
          return res.status(500).json({
            status: "error",
            message: "There was an error uploading brief",
            data: null,
          });
        }

        const newFile = File.create({
          url: result.secure_url,
          cloud_id: result.public_id,
          type: result.resource_type,
          user: req.user.id,
          folder: folder || "general",
        });
        await newFile.save();
        return res.status(200).json({
          status: "success",
          message: "File upload was successful",
          data: newFile,
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      status: "error",
      data: null,
    });
  }
};
