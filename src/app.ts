import express, { Application } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
// import routes from "./routes/index";

const connectDB = require("./config/dbconnection");

 connectDB();

const app: Application = express();

app.use(helmet());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(routes);

export default app;
