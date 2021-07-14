import createError from "http-errors"
import UserModel from "../services/users/schema.js"
import { verifyToken } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) next(createError(401, "Authorization not provided"))
    else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")
            const content = await verifyToken(token)
            const user = await UserModel.findById(content._id)

            if (user) {
                req.user = user
                next()
            } else next(createError(404, "User not found"))
        } catch (error) {
            next(createError(401, "Token not valid"))
        }
    }
}
