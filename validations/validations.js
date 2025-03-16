import { body } from "express-validator";

export const loginValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must contain minimum 6 symbols").isLength({
    min: 6,
  }),
];

export const dataCreateValidation = [
  body("timer", "Timer must be a string").optional().isString(),
  body("token", "Token must be an object").optional().isObject(),
  body("tokenomics_link", "Tokenomics link must be a valid URL")
    .optional()
    .isURL(),
  body("whitepaper_link", "Whitepaper link must be a valid URL")
    .optional()
    .isURL(),
  body("whitepaper_text", "Whitepaper text must be a string")
    .optional()
    .isString(),
];
