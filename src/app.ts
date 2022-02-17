import express, { Application } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import AdminRoutes from "./routes/admin";
import UserRoutes from "./routes/user";

const connectDB = require("./config/dbconnection");

connectDB();

const app: Application = express();

app.use(helmet());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/admin",AdminRoutes);
app.use("/api/user",UserRoutes);

app.get("/", (req, res) => {
    res.redirect("/api");
  });
  

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cloud Backup API.",
    api_doc: "https://github.com/Gwachukwu/cloud_backup/blob/main/README.md",
  });
});

app.get("/api/docs", (req, res) => {
  res.redirect("https://github.com/Gwachukwu/cloud_backup/blob/main/README.md");
});

export default app;
