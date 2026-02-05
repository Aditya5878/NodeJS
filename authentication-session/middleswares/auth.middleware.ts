import express from "express";

import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tokenHeader = req.headers["authorization"];

    // Header authorization : Bearer <TOKEN>

    if (!tokenHeader) {
      return next();
    }

    if (!tokenHeader.startsWith("Bearer")) {
      return res
        .status(400)
        .json({ error: "authorization header must start with Bearer" });
    }

    const token = tokenHeader.split(" ")[1];
    const secret = process.env.JWT_SERCER as string;
    const decoded = jwt.verify(token, secret);

    req.user = decoded as {
      sessionId: string;
      userID: string;
      name: string;
      email: string;
      role: string;
    };
    next();
  } catch {
    next();
  }
};


export const ensureAuthenticated = async function(req : Request , res: Response, next : NextFunction){
    if(!req.user){
        return res.status(400).json({error :"You must be authenticated to see this data"})
    }
    next();
}


export const restrictToRole = async function (role : any) {

    return function(req: Request , res: Response, next: NextFunction){
        if(req.user.role !== role){
            return res.status(400).json({error : "You are not authorized"});
        }

        next();
    }
    
}