import express from 'express'
import UserModel from './schema.js'

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

usersRouter.get("/", async(req,res,next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})


export default usersRouter