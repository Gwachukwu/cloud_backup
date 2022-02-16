import { createConnection } from "typeorm";
import { Admin } from "../entities/admin";
import { File } from "../entities/file";
import { User } from "../entities/user";
const dbConfig = require("./ormconfig.ts");

module.exports = async () => {
  try {
    await createConnection({
      ...dbConfig,
      entities: [User, File, Admin],
      synchronize: true,
    });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
