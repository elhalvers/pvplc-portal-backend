import { Request, Response } from "express";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";

export async function getUser(req: Request, res: Response) {
  res.json("success");
}

export async function login(req: Request, res: Response) {
  const cookies = req.cookies;
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
  const foundUser = await User.findOne({ login: username, password }).select("-password").lean();
  console.log(foundUser);

  if (!foundUser) return res.status(401).json({ message: "User doesn't exist or passwords don't match" });
  else {
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
    if (cookies?.jwt)
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.json({ user: foundUser });
  }
}

export async function signout(req: Request, res: Response) {
  const cookies = req.cookies;
  if (cookies?.jwt)
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  res.json({ message: "signed out and cleared cookie" });
}

export async function checkJWT(req: any, res: Response) {
  const foundUser = await User.findOne({ login: req.login }).select("-password").lean();
  console.log("foundUser");

  if (!foundUser) return res.status(401).json({ message: "User doesn't exist or passwords don't match" });
  res.json({ user: foundUser });
}
