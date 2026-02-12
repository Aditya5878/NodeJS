// import mongoose, { Schema, model } from "mongoose";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// const userSchema = new Schema(
//   {
//     avatar: {
//       type: {
//         url: String,
//         localPath: String,
//       },
//       default: {
//         url: `https://placeholder.co/200x200`,
//         path: "",
//       },
//     },

//     username: {
//       type: String,
//       require: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     fullName: {
//       type: String,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     isEmainVerified: {
//       type: Boolean,
//       default: false,
//     },
//     refreshToken: {
//       type: String,
//     },
//     forgotPasswordToken: {
//       type: String,
//     },
//     forgotPasswordExpiry: {
//       type: Date,
//     },
//     emailVerificationToken: {
//       type: String,
//     },
//     emailVerificationExpiry: {
//       type: Date,
//     },
//   },
//   { timestamps: true },
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // here isPasswoedCorrect  is just a name of method.
// userSchema.methods.isPasswordCorrect = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//     },
//     process.env.ACCESS_TOKEN_SECRET!,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRES! },
//   );
// };

// userSchema.methods.generateRefreshToken  = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//     },
//     process.env.REFRESH_TOKEN_SECRET!,
//     { expiresIn: process.env.REFRESH_TOKEN_EXPIRES! },
//   );
// };

// userSchema.methods.generateTemporaryToken = function(){
//     const unHashedToken = crypto.randomBytes(20).toString("hex");
//     const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");

//     const tokenExpiry = Date.now() + (20*60*1000) // 20 mins
//     return {unHashedToken, hashedToken , tokenExpiry};
// }

// export const User = mongoose.model("user", userSchema);

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv"

/* ================= ENV HELPER ================= */

const env = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES as string,
};

/* ================= USER INTERFACE ================= */

export interface IUser extends Document {
  avatar?: {
    url?: string;
    localPath?: string;
  };

  username: string;
  fullName?: string;
  email: string;
  password: string;

  isEmailVerified: boolean;

  refreshToken?: string;

  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;

  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;

  /* ===== METHODS ===== */
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): {
    unHashedToken: string;
    hashedToken: string;
    tokenExpiry: number;
  };
}

/* ================= SCHEMA ================= */

const userSchema = new Schema<IUser>(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placeholder.co/200x200",
        localPath: "",
      },
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: String,

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,

    emailVerificationToken: String,
    emailVerificationExpiry: Date,
  },
  { timestamps: true }
);

/* ================= PASSWORD HASH MIDDLEWARE ================= */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* ================= METHODS ================= */

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    env.ACCESS_TOKEN_SECRET,
    // { expiresIn: env.ACCESS_TOKEN_EXPIRES }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    env.REFRESH_TOKEN_SECRET,
    // { expiresIn: env.REFRESH_TOKEN_EXPIRES }
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes

  return { unHashedToken, hashedToken, tokenExpiry };
};

/* ================= MODEL EXPORT ================= */

export const User = mongoose.model<IUser>("User", userSchema);
