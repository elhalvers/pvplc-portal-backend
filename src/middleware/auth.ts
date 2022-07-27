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
    if (roles.includes("ADMIN") || roles.includes("MOD")) next();
    else if (id) {
      const result: any = await Report.findById(id).populate("createdBy", "login").lean();
      if (typeof result == "undefined" || !result) throw "Doesn't exist";
      console.log("result", result);
      if (result.createdBy.login == login) {
        next();
      } else throw "logins don't match";
    } else throw "No id";
  } catch (error) {
    console.log("here2");
    res.status(403).json({ message: "Not authorized", error });
  }
}

export function canUpdate(req: any, res: Response, next: NextFunction) {
  if (req.body.login || req.body.roles) {
    console.log("here");

    if (req.roles.includes("ADMIN")) next();
    else res.json({ message: "no permission to update", roles: req.roles });
  } else next();
}

export function isAdmin(req: any, res: Response, next: NextFunction) {
  if (req.roles.includes("ADMIN")) next();
  else res.json({ message: "no permission to create", roles: req.roles });
}
