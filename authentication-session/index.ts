import express from "express";
import type { Response, Request, NextFunction } from "express";
import "dotenv";
import { db } from "./db/index";
import { usersTable, userSessions } from "./db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
const port = process.env.PORT ?? 8000;
const app = express();
import { userRouter } from "./routes/user.routes";
import { adminRouter } from "./routes/admin.route";

import {authenticationMiddleware,ensureAuthenticated} from "./middleswares/auth.middleware";

app.use(express.json()); // because we are providing json data in body.

// what of a user wants to update the name in db:
// app.use(async (req: Request, res: Response, next: NextFunction) => {
//   // const sessionId = req.headers['session-id'];
//   // if (!sessionId) {
//   //   return next();
//   // }

//   // const [data] = await db
//   // .select({
//   //   sessionId: userSessions.id,
//   //   userID: userSessions.userId,
//   //   name: usersTable.name,
//   //   email: usersTable.email,
//   // })
//   // .from(userSessions)
//   // .innerJoin(usersTable, eq(usersTable.id, userSessions.userId))
//   // .where(eq(
//   //   userSessions.id,
//   //   typeof sessionId === "string" ? sessionId : sessionId[0]
//   // ));

//   //   if (!data) {
//   //   return next();
//   // }

//   // req.user = data;

//   try {
//     const tokenHeader = req.headers["authorization"];

//     // Header authorization : Bearer <TOKEN>

//     if (!tokenHeader) {
//       return next();
//     }

//     if (!tokenHeader.startsWith("Bearer")) {
//       return res
//         .status(400)
//         .json({ error: "authorization header must start with Bearer" });
//     }

//     const token = tokenHeader.split(" ")[1];
//     const secret = process.env.JWT_SERCER as string;
//     const decoded = jwt.verify(token, secret);

//     req.user = decoded as {
//       sessionId: string;
//       userID: string;
//       name: string;
//       email: string;
//     };
//     next();
//   } catch {
//     next();
//   }
// });

// instead of above use middleware.

app.use(authenticationMiddleware);
app.use("/user", userRouter);
app.use("/admin" , adminRouter);

app.listen(port, () => {
  console.log(`Server is running on Port : ${port}`);
});
