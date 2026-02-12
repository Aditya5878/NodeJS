// import { Request, Response, NextFunction } from "express";

// const asyncHandler = (requestHandler) =>{
//     return (req :Request, res: Response , next: NextFunction) =>{
//         Promise
//         .resolve(requestHandler(req, res , next))
//         .catch((err) => next(err));

//     }
// }


// export {asyncHandler}

// import { Request, Response, NextFunction, RequestHandler } from "express";

// export const asyncHandler =
//   (fn: RequestHandler): RequestHandler =>
//   (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };

import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
    fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
