const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        Subject: {
            type: String,
            required: true,
            trim: true,
        },
        Marks: {
            type: Number,
            require: true
        },
        teacherId: {
            type: ObjectId,
            ref: "teacher",
            required: true
        },
        isDeleted:{
            type:"string",
            default:"false"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("student", authorSchema);