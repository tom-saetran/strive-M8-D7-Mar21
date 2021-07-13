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

export default model("Blog", BlogSchema)
