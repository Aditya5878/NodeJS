import { User } from "../models/user.models";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  email: string;
  username: string;
}

interface VerifyEmailParams {
  verificationToken: string;
}
/* -------------------------------------------------- */
/* 🔐 Generate tokens */
/* -------------------------------------------------- */
const generateAccessAndRefreshTokens = async (
  userId: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN ERROR:", error); // 👈 shows real issue
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

/* -------------------------------------------------- */
/* 📝 Register user */
/* -------------------------------------------------- */
const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, username, password, role } = req.body as {
      email: string;
      username: string;
      password: string;
      role?: string;
    };

    // 1️⃣ Check existing user
    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with username or email already exists");
    }

    // 2️⃣ Create user
    const user = await User.create({
      email,
      username,
      password,
      isEmailVerified: false,
    });

    // 3️⃣ Generate email verification token
    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = new Date(tokenExpiry);

    await user.save({ validateBeforeSave: false });

    // 4️⃣ Send verification email
    await sendEmail({
      email: user.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
      ),
    });

    // 5️⃣ Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    // 6️⃣ Final response
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: createdUser },
          "User registered successfully. Verification email sent.",
        ),
      );
  },
);

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or username is required.");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id.toString(),
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

const getCurrentuser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched Successfully"));
});

const verifyEmail = asyncHandler(
  async (req: Request<VerifyEmailParams>, res: Response) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      throw new ApiError(404, "Email Verification Token is missing.");
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Token is expired or invalid");
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.isEmailVerified = true;

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isEmailVerified: true }, "Email is verified"),
      );
  },
);

const resendEmailVerification = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is alreaady verified.");
  }

  // 3️⃣ Generate email verification token
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = new Date(tokenExpiry);

  await user.save({ validateBeforeSave: false });

  // 4️⃣ Send verification email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email Id"));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as JwtPayload;
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken != user.refreshToken) {
      throw new ApiError(401, "Invalid refresh is Expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: newRefreshToken },
          "Access Token Refreshed",
        ),
      );
  } catch {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

const forgotPasswordRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User does not exists", []);
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.forgotPasswordExpiry = new Date(tokenExpiry);
    user.forgotPasswordToken = hashedToken;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Password reset request",
      mailgenContent: forgotPasswordMailgenContent(
        user.username,
        `${process.env.FORGOT_PASSWORD_URL}/${unHashedToken}`,
      ),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Reset mail has been sent"));
  },
);

const resetForgotPassword = asyncHandler(
  async (req: Request<VerifyEmailParams>, res: Response) => {
    const { verificationToken } = req.params;
    const { newPassword } = req.body;

    let hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(489, "Token is invalid or Expired");
    }

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordExpiry = undefined;

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
  },
);

const changeCurrentPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new ApiError(200, "Invalid Old Password");
    }

    const isPasswordValid = await user?.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changes Successfully"));
  },
);

export {
  registerUser,
  generateAccessAndRefreshTokens,
  login,
  logoutUser,
  getCurrentuser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
};
