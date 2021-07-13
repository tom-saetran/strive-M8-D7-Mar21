import bcrypt from 'bcrypt'

const plainPW = "1234"
const plainPW2 = "1235"

console.time("bcrypt")
const hash = bcrypt.hashSync(plainPW, 10)
console.timeEnd("bcrypt")
console.log(hash)

const isEqual = bcrypt.compareSync(plainPW, hash)

console.log(isEqual)