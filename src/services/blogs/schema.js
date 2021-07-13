import mongoose from "mongoose"

const { Schema, model } = mongoose

const BlogSchema = new Schema(
    {
        category: { type: String, required: true },
        content: { type: String, required: true },
        authors: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
    },
    { timestamps: true }
)

BlogSchema.methods.toJSON = function () {
    const schema = this
    const object = schema.toObject()
    delete object.__v

    return object
}

export default model("Blog", BlogSchema)
