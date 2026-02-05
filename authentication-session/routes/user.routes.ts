import express from "express";
import type { Request, Response } from "express";
import { db } from "../db/index";
import { usersTable, userSessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, createHmac, randomUUID } from "node:crypto";
import jwt from 'jsonwebtoken';
import 'dotenv';

import {ensureAuthenticated} from "../middleswares/auth.middleware"
const router = express.Router();

router.patch("/", ensureAuthenticated ,async (req: Request, res: Response) => {
 
  const { name } = req.body;
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ error: "You are not Logged in." });
  }

  await db.update(usersTable).set({ name }).where(eq(usersTable.id, user.userID!));

  return res.status(200).json({ message: " updated successfully" });
});

// router.get("/", async (req: Request, res: Response) => {
//   const user = req.user;

//   if (!user) {
//     return res.status(401).json({ error: "You are not Logged in." });
//   }

//   return res.status(200).json({ user });
// });

// use middleware instead
router.get("/", ensureAuthenticated, async (req: Request, res: Response) => {
  const user = req.user;
  return res.status(200).json({ user });
});

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email and password are required" });
  }

  const [existingUser] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `user with email ${email} already exists` });
  }

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({
    status: "success",
    data: { userId: user.id },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //search is this an existing user or not
  const [existingUser] = await db
    .select({
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
      id: usersTable.id,
      name : usersTable.name,
      role : usersTable.role
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!existingUser) {
    return res
      .status(404)
      .json({ error: `user with email ${email} does not exists` });
  }

  const salt = existingUser.salt;
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== existingUser.password) {
    return res.status(400).json({ error: "Incorrect Password" });
  }

  // const [session] = await db
  //   .insert(userSessions)
  //   .values({
  //     userId: existingUser.id, // store the id of user as userId in userSession table
  //   })
  //   .returning({ id: userSessions.id }); // and return the randomly generated id (for the row which includes  userId: existingUser.id )

  // Items used to generate jwt token
  const payload = {
    id : existingUser.id,
    email : existingUser.email,
    name : existingUser.name,
    role : existingUser.role
  }

  const secretKey = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secretKey);

  // return res.status(200).json({ status: "Success", sessionId: session.id });
  return res.status(200).json({ status: "Success", token: token });


});

export { router as userRouter };
