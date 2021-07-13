import express from 'express'
import UserModel from './schema.js'
import {basicAuthMiddleware} from '../../auth/basic.js'
import { adminOnly } from '../../auth/admin.js'

const usersRouter = express.Router()

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)

    const {_id} = await newUser.save()

    res.status(201).send({_id})

  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", basicAuthMiddleware, adminOnly, async(req,res,next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
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

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
  } catch (error) {
    next(error)
  }
})


usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {

    // modifiy the user with the fields coming from req.body

    req.user.name = "Whatever"

    await req.user.save()
  } catch (error) {
    next(error)
  }
})


export default usersRouter