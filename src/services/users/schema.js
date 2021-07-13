import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const {Schema, model} = mongoose

const UserSchema = new Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})

UserSchema.pre("save", async function(next){
  const newUser = this

  const plainPw = newUser.password

  if(newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPw, 10)
  }
  next()
})

UserSchema.methods.toJSON = function() { // toJSON is a method called every time express does a res.send

  const user = this

  const userObject = user.toObject()

  delete userObject.password

  delete userObject.__v

  return userObject
}

export default model("User", UserSchema)