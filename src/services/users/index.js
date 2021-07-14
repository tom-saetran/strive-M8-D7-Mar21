import q2m from "query-to-mongo"
import express from "express"
import UserModel from "./schema.js"
import createError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { checkUserEditPrivileges } from "../../auth/admin.js"
import { LoginValidator, UserValidator } from "./validator.js"
import { refreshTokens } from "../../auth/tools.js"

const usersRouter = express.Router()

usersRouter.post("/signup", UserValidator, async (req, res, next) => {
    try {
        const entry = new UserModel(req.body)
        const { _id } = await entry.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/login", LoginValidator, async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.checkCredentials(email, password)

        if (user) {
            const { accessToken, refreshToken } = await JWTAuthenticate(user)
            res.send({ accessToken, refreshToken })
        } else next(createError(401))
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/refreshToken", async (req, res, next) => {
    try {
        // actual refresh token is coming from req.body
        if (!req.body.refreshToken) next(createError(400, "Refresh Token not provided"))
        else {
            const { newAccessToken, newRefreshToken } = await refreshTokens(req.body.refreshToken)
            res.send({ newAccessToken, newRefreshToken })
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const total = await UserModel.countDocuments(query.criteria)
        const limit = 25
        const result = await UserModel.find(query.criteria)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)

        res.status(200).send({ links: query.links("/users", total), total, result })
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/me/stories", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const result = await UserModel.findById(req.user._id).populate("blogs")
        res.status(200).send(result.blogs)
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.status().send("User terminated")
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        req.body.name ? (req.user.name = req.body.name) : null
        req.body.surname ? (req.user.surname = req.body.surname) : null
        req.body.email ? (req.user.email = req.body.email) : null

        const result = await req.user.save()

        res.status(200).send(result)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:id", async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else {
            const result = await UserModel.findById(req.params.id).populate("blogs")
            if (!result) next(createError(404, `ID ${req.params.id} was not found`))
            else res.status(200).send(result)
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:id/stories", JWTAuthMiddleware, async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else {
            const result = await UserModel.findById(req.params.id).populate("blogs")
            if (!result) next(createError(404, `ID ${req.params.id} was not found`))
            else res.status(200).send(result.blogs)
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/:id", JWTAuthMiddleware, checkUserEditPrivileges, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await UserModel.findByIdAndDelete(req.params.id, { useFindAndModify: false })

        if (result) res.status(200).send("User Terminated")
        else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/:id", JWTAuthMiddleware, checkUserEditPrivileges, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await UserModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true, useFindAndModify: false })

        if (!result) next(createError(404, `ID ${req.params.id} was not found`))
        else res.status(200).send(result)
    } catch (error) {
        next(error)
    }
})

export default usersRouter
