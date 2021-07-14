import { body } from "express-validator"

export const BlogValidator = [
    body("category").exists().withMessage("Category is a mandatory field"),
    body("content").exists().withMessage("Content is a mandatory field")
]
