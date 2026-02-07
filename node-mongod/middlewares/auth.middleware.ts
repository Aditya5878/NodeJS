import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/jwt";

export const authmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    if (!tokenHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        error: "Authorization header must be 'Bearer <token>'",
      });
    }

    const token = tokenHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secretKey);

    if (typeof decoded === "string") {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = decoded as JwtUserPayload;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const ensureAuthenticated = async(req : Request , res: Response , next : NextFunction) =>{
    if(!req.user){
        return res.status(401).json({error :"You are not authorized"});
    }
    
    next();
}


