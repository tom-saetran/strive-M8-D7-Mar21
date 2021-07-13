import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const {Schema, model} = mongoose

const UserSchema = new Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required:true, enum: ["Admin", "User"]}
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

UserSchema.statics.checkCredentials = async function(email, plainPw) {
// 1. find user in db by email

  const user = await this.findOne({email})

  if(user){
    // 2. compare plainPw with hashed pw
    const hashedPw = user.password

    const isMatch = await bcrypt.compare(plainPw, hashedPw)

    // 3. return a meaningful response

    if(isMatch) return user
    else return null

  } else {
    return null
  } 


}

export default model("User", UserSchema)