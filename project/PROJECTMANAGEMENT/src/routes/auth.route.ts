import { Router } from "express";

import {
  registerUser,
  login,
  logoutUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  getCurrentuser,
  changeCurrentPassword,
  resendEmailVerification,
} from "../controllers/auth.controllers";
import {
  userRegisterValidator,
  userLoginvalidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index";
import { validate } from "../middlewares/validator.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();1

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginvalidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:verificationToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

// Secure Routes Requires jwt
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentuser);
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate ,changeCurrentPassword);
router.route("/resent-email-verification").get(verifyJWT, resendEmailVerification);

export default router;
