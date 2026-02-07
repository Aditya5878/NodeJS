import express from "express";
import { User } from "../models/user.model";
import { Response, Request, NextFunction } from "express";
import { randomBytes, createHmac } from "crypto";
import jwt from "jsonwebtoken"; 
import  {ensureAuthenticated} from '../middlewares/auth.middleware'
const router = express.Router();


router.patch('/' , ensureAuthenticated , async(res : Response , req : Request) =>{

        const {name}  = req.body;

        await User.findByIdAndUpdate(req.user?._id ,{
            name,
        })

        return res.json({status :"Success"});

});

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ error: ` User with email ${email} already exists` });
  }

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const user = await User.insertOne({
    name,
    email,
    password: hashedPassword,
    salt,
  });

  return res.status(201).json({ status: "Success" , id : {id : user._id}});
});

router.post('/login' , async(req:Request , res : Response) =>{
    const {email , password} = req.body ;
      const existingUser = await User.findOne({
    email,
  });

  if (!existingUser) {
    return res
      .status(400)
      .json({ error: ` User with email ${email} does not exist.` });
  }

  // if exist check if password is correct or not.

  const salt: string = existingUser.salt;  // get salt from db
  const hashed: string = existingUser.password;

  const newHash : string = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashed !== newHash){
    return res.status(404).json({error:'Worong password'});
  }

  // create a session 

  const payload = {
    _id : existingUser._id,
    name : existingUser.name,
    email : existingUser.email
  }

  const secretKey = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secretKey);

  return res.status(200).json({status : "success" , token :token});

})

export default router;
