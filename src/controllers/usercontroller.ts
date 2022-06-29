import { Request, Response } from "express";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";

export async function getUser(req: Request, res: Response) {
  res.json("success");
  const user = new User({ age: 26, name: "kyle" });
  await user.save();
}

export async function login(req: Request, res: Response) {
  const cookies = req.cookies;
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
  const foundUser = await User.findOne({ login: username }).exec();
  if (!foundUser) return res.status(401).json({ message: "User doesn't exist or passwords don't match" });
  if (foundUser.password == password) {
    const roles = foundUser.roles;
    const token = jwt.sign(
      {
        login: foundUser.login,
        name: foundUser.name,
        _id: foundUser._id,
        roles: roles,
      },
      <string>process.env.SECRET,
      { expiresIn: "1d" }
    );
    if (cookies?.jwt) res.clearCookie("jwt", { httpOnly: true });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === "development" ? ".localhost" : ".pvplc-portal-client.vercel.app",
    });
    res.json({ user: foundUser });
  } else res.status(401).json({ message: "Passwords don't match" });
}

export async function signout(req: Request, res: Response) {
  const cookies = req.cookies;
  if (cookies?.jwt) res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
  res.json({ message: "signed out and cleared cookie" });
}

export async function checkJWT(req: any, res: Response) {
  console.log(req.login);
  const foundUser = await User.findOne({ login: req.login }).exec();
  if (!foundUser) return res.status(401).json({ message: "User doesn't exist or passwords don't match" });
  res.json({ user: foundUser });
}
