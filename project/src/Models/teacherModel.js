const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
            
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        password: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("teacher", teacherSchema);






