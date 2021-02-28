import dotenv from "dotenv";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import users from "./data/users.js";
import artist from "./data/artsit.js";
import User from "./models/userModel.js";
import Artist from "./models/artistModel.js";
import { nanoid } from "nanoid";

//load .env config in process
dotenv.config();

//connect to mongoDB
connectDB();

const importData = async () => {
  try {
    // await User.deleteMany();
    await Artist.deleteMany();

    // await User.insertMany(users);
    await Artist.insertMany(artist);

    console.log("Data Imported!!".green);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed!!".red.bold);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.bold);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
