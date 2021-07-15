import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"

import UserModel from "../services/users/schema.js"
import { JWTAuthenticate } from "../auth/tools.js"

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:666/users/login/oauth/google/redirect"
        },
        async (accessToken, refreshToken, profile, next) => {
            try {
                const user = await UserModel.findOne({ googleOAuth: profile.id })
                if (user) {
                    const tokens = await JWTAuthenticate(user)
                    next(null, { user, tokens })
                } else {
                    const newUser = {
                        firstname: profile.name.givenName,
                        surname: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleOAuth: profile.id
                    }

                    const createdUser = new UserModel(newUser)
                    const savedUser = await createdUser.save()
                    const tokens = await JWTAuthenticate(savedUser)
                    next(null, { user: savedUser, tokens })
                }
            } catch (error) {
                next(error)
            }
        }
    )
)

passport.serializeUser((user, next) => next(null, user))

export default {}
