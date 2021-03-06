import cors from "cors"
import express from "express"
import passport from "passport"
import oauth from "./auth/oauth.js"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import usersRoutes from "./services/users/index.js"
import blogsRoutes from "./services/blogs/index.js"
import { unAuthorizedHandler, forbiddenHandler, catchAllHandler, error400 } from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

// MIDDLEWARES
server.use(cors({ origin: "http://localhost:3000", credentials: true }))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())

// ROUTES
server.use("/users", usersRoutes)
server.use("/blogs", blogsRoutes)

// ERROR HANDLERS
server.use(error400)
server.use(unAuthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.table(listEndpoints(server))

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connection.on("connected", () => server.listen(port, () => console.log("Server running on port:", port)))
mongoose.connection.on("error", err => console.log("Mongo connection error ", err))
