import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/usermodel";

export function checkJWT(req: any, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, <string>process.env.SECRET, async (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ status: false });
      } else {
        console.log("token", decoded);
        req._id = decoded._id;
        req.login = decoded.login;
        req.roles = decoded.roles;
        next();
      }
    });
  } else {
    res.status(403).json({ status: false });
  }
}
