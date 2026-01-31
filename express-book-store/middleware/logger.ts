import express from "express";

import { Response , Request , NextFunction } from "express";
import fs from "fs"



export function loggerMiddleware(req : Request , res: Response , next : NextFunction){
  const method = req.method;
  const path = req.url;
  const log = `[${new Date().toISOString()}]:${method}:${path}`;
  fs.appendFileSync("log.txt", log, "utf-8");
  next();
};