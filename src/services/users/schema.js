import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ["Admin", "User"], default: "User" },
        blogs: [{ type: Schema.Types.ObjectId, ref: "Blog", required: true }]
    },
    { timestamps: true }
)

UserSchema.pre("save", async function (next) {
    const newUser = this
    const plainPw = newUser.password
    if (newUser.isModified("password")) newUser.password = await bcrypt.hash(plainPw, 10)

    next()
})

UserSchema.methods.toJSON = function () {
    const schema = this
    const object = schema.toObject()
    delete object.password
    delete object.__v

    return object
}

UserSchema.statics.checkCredentials = async function (email, plainPw) {
    const user = await this.findOne({ email })

    if (user) {
        const hashedPw = user.password
        const isMatch = await bcrypt.compare(plainPw, hashedPw)

        if (isMatch) return user
        else return null // wrong pw
    } else return null //  user not in db
}

export default model("User", UserSchema)
