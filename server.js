import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

//load .env config in process
dotenv.config();

//connect to mongoDB
connectDB();

const app = express();

//Middleware : CORS
app.use(cors());

//Middleware : logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  console.log = () => {}; // disable console log in production
}

//Middleware : parse json body
app.use(express.json());

app.get("/", (req, res) => {
  console.log("/");

  res.send("API is running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/artist", artistRoutes);

//Middleware : custom error handler
app.use(notFound);
app.use(errorHandler);

//start server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
