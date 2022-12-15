const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    Subject: {
        type: String,
        required: true
    },
    Marks: {
        type: Number,
        required: true
    },
    deletedAt : Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    teacherId: {
        type: ObjectId,
        required: true,
        ref: 'tail-teacher'
    }

}, { timestamps: true })

module.exports = mongoose.model('tail-student', studentSchema)