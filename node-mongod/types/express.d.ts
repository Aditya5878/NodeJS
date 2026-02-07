export {}; // important so file is treated as module

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
      };
    }
  }
}
import { JwtUserPayload } from "./jwt";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
