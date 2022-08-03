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

app.use(express.json({ limit: "200mb" }));

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://pvplc-portal-client.vercel.app",
      "http://143.198.132.8:8080",
      "https://testingplatform.xyz",
      "https://www.testingplatform.xyz",
    ],
  })
);
app.use(morgan("tiny"));
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);

const uri: string = `mongodb+srv://tim:${process.env.MONGO_PASSWORD}@cluster0.k1aaw.mongodb.net/portalpvplc?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB Connetion Successfull");
    app.listen(PORT, () => {
      console.log("listening on port", PORT);
    });
  })
  .catch((err) => {
    console.error(err);
    console.log("connected to db");
  });
mongoose.set("runValidators", true);
const PORT = process.env.PORT || 3080;
