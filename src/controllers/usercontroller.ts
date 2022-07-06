import { Request, Response } from "express";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";

export async function getUsers(req: Request, res: Response) {
  try {
    const results = await User.find({}).select("-password -note").lean();
    console.log(results);

    if (results) {
      res.json({ users: results });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't load " });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const id = req.params?.id;
    const result = await User.findById(id).select("-password").lean();
    console.log(result);
    if (result) {
      res.json({ user: result });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't load", error });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params?.id;
    if (!id) throw "No id";
    const result = await User.deleteOne({ _id: id }).lean();
    if (result) {
      res.json({ deleted: result });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't load", error });
  }
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

export async function update(req: any, res: Response) {
  const { name, email, note }: { [key: string]: string } = req.body;
  try {
    const result = await User.findById(req._id, "-password");
    if (!result) throw "Doesn't exist";
    result.name = name;
    result.email = email;
    result.note = note;
    const saved = await result.save();
    const JSONED = saved.toJSON();
    res.json({ message: "Successfully updated user", user: JSONED });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User doesn't exist", error });
  }
}

export async function updateUser(req: any, res: Response) {
  const { name, email, note, login, roles }: { [key: string]: string | undefined } = req.body;
  try {
    console.log("here 2");

    const id = req.params?.id;
    const result = await User.findById(id, "-password");
    if (!result) throw "Doesn't exist";
    if (name) result.name = name;
    if (email) result.email = email;
    if (note) result.note = note;
    if (login) result.login = login;
    if (roles) result.roles = roles.split(" ");
    const saved = await result.save();
    const JSONED = saved.toJSON();
    res.json({ message: "Successfully updated user", user: JSONED });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User doesn't exist", error });
  }
}

export async function createUser(req: any, res: Response) {
  const { name, email, note, login, roles, password }: { [key: string]: string } = req.body;
  try {
    console.log("here 2");
    const newuser = new User({ name, email, login, roles: roles.split(" "), password, note });
    const saved = await newuser.save();
    const JSONED = saved.toJSON();
    res.json({ message: "Successfully updated user", user: JSONED });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Couldn't create user", error });
  }
}
