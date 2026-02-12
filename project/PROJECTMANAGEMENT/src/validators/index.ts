import { body } from "express-validator";

export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("username musst be atleast 3 chars"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("FullName").optional().trim(),
  ];
};


export const userLoginvalidator =() =>{
  return [
     body("email")
      .optional()
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
    .notEmpty()
    .withMessage("Password is required")
  ]
}



export const userChangeCurrentPasswordValidator = () =>{

  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];

}


export const userForgotPasswordValidator = () =>{
  return [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid")
  ];
}


export const userResetForgotPasswordValidator = () =>{
  return [
    body("newPassword").notEmpty().withMessage("Password is required"),
  ]
}