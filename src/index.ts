import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routes/users";
import reportsRouter from "./routes/reports";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(morgan("tiny"));
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);

const uri: string = `mongodb+srv://tim:${process.env.MONGO_PASSWORD}@cluster0.k1aaw.mongodb.net/portalpvplc?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.error(err);
    console.log("connected to db");
  });

const PORT = process.env.PORT || 3080;

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
