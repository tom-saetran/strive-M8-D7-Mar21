import createError from "http-errors"

export const adminOnly = (req, res, next) => {
    if (req.user.role === "Admin") next()
    else next(createError(403, "Admins only!"))
}

export const checkUserEditPrivileges = (req, res, next) => {
    if (req.user.role === "Admin" || req.user._id === req.params.id) next()
    else next(createError(403, "Unauthorized"))
}

export const checkPostEditPrivileges = (req, res, next) => {
    // TODO!
    if (req.user.role === "Admin" || req.user._id === req.params.id) next()
    else next(createError(403, "Unauthorized"))
}
