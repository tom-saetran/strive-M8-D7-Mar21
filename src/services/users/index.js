import q2m from "query-to-mongo"
import express from "express"
import UserModel from "./schema.js"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { checkEditPrivileges } from "../../auth/admin.js"
import { UserValidator } from "./validator.js"

const usersRouter = express.Router()

usersRouter.post("/register", UserValidator, async (req, res, next) => {
    try {
        const entry = new UserModel(req.body)
        const { _id } = await entry.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
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

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
    try {
        const result = await UserModel.findById(req.user._id).populate("blogs")
        res.status(200).send(result.blogs)
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.status().send("User terminated")
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
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

usersRouter.get("/:id/stories", basicAuthMiddleware, async (req, res, next) => {
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

usersRouter.delete("/:id", basicAuthMiddleware, checkEditPrivileges, async (req, res, next) => {
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

usersRouter.put("/:id", basicAuthMiddleware, checkEditPrivileges, async (req, res, next) => {
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
