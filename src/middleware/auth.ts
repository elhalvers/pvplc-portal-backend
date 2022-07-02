import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Report from "../models/reportmodel";

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

export async function hasAccess(req: any, res: Response, next: NextFunction) {
  const id: string | undefined = req.params.id;
  const roles = req.roles;
  const login = req.login;
  try {
    // if (roles.includes("ADMIN") || roles.includes("MOD")) next();
    if (id) {
      const result: any = await Report.findById(id).populate("createdBy", "login").lean();
      if (typeof result == "undefined" || !result) throw "Doesn't exist";
      console.log("result", result);
      if (result.createdBy.login == req.login) {
        next();
      } else throw "logins don't match";
    } else throw "No id";
  } catch (error) {
    console.log("here2");
    res.status(403).json({ message: "Not authorized", error });
  }
}
