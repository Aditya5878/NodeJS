// import { validationResult } from "express-validator";
// import { ApiError } from "../utils/api-error";
// import { Request, Response, NextFunction } from "express";

// export const validate = (req: Request, res: Response, next: NextFunction) => {
//   const errors = validationResult(req);

//   if (errors.isEmpty()) {
//     return next();
//   }

//   const extractedErrors: Record<string, string>[] = [];

//   errors.array().forEach((err) => {
//     extractedErrors.push({
//       [err.path]: err.msg,
//     });
//   });

//   throw new ApiError(422, "Received data is not valid", extractedErrors);
// };


import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith((err) => ({
    field: err.type === "field" ? err.path : "unknown",
    message: err.msg,
  }));

  if (errors.isEmpty()) {
    return next();
  }

  throw new ApiError(422, "Received data is not valid", errors.array());
};
