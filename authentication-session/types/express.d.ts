declare global {
  namespace Express {
    interface Request {
      user?: {
        sessionId: string;
        userID: string;
        name: string;
        email: string;
      };
    }
  }
}

export {};
