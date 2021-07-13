import createError from "http-errors"
import atob from "atob"

import UserModel from "../services/users/schema.js"

export const basicAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createError(401, "Please provide credentials in the authorization header!"))
    } else {
        const decoded = atob(req.headers.authorization.split(" ")[1])
        const [email, password] = decoded.split(":")
        const user = await UserModel.checkCredentials(email, password)

        if (user) {
            req.user = user
            next()
        } else {
            next(createError(401, "Credentials are not correct!"))
        }
    }
}
