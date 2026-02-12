import { ApiResponse } from "../utils/api-response";
import { Response, Request, NextFunction } from "express";
import {asyncHandler} from "../utils/async-handler";

/*
const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (error) {
    next(error);
  }
};
*/



// with asynchandler 

const healthCheck = asyncHandler(async(req: Request , res: Response) =>{
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
})

export { healthCheck };
