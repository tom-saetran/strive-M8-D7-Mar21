import { body } from "express-validator"

export const UserValidator = [
    body("firstname").exists().withMessage("Firstname is a mandatory field"),
    body("surname").exists().withMessage("Surname is a mandatory field"),
    body("email").exists().isLength({ max: 50 }).withMessage("Email is a mandatory field").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").exists().isLength({ min: 8, max: 128 }).withMessage("Password is a mandatory field and needs to be at least 8 character")
]

export const LoginValidator = [
    body("email").exists().withMessage("Email is a mandatory field").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password is a mandatory field")
]
