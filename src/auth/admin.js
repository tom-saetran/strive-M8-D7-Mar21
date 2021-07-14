import createError from "http-errors"
import BlogModel from "../services/blogs/schema.js"

export const adminOnly = (req, res, next) => {
    if (req.user.role === "Admin") next()
    else next(createError(403))
}

export const checkUserEditPrivileges = (req, res, next) => {
    if (req.user.role === "Admin" || req.user._id === req.params.id) next()
    else next(createError(403))
}

export const checkPostEditPrivileges = async (req, res, next) => {
    const { authors } = await BlogModel.findById(req.params.id)
    if (authors.filter(id => id === req.user._id)) next()
    if (req.user.role === "Admin") next()
    else next(createError(403))
}
