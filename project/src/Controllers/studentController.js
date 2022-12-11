const mongoose = require("mongoose");
const teacherModel = require("../models/teacherModel");
const studentModel = require("../models/studentModel");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

//------------------ students create-------------------------------------------

const createstu = async function (req, res) {
    try {
        let studentData = req.body;
        let { name, Marks, Subject, teacherId } = studentData

        if (Object.keys(studentData).length === 0) {
            return res.status(400).send({ status: false, message: "Please give some data" });
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "name is missing or you left empty" });
        }
        if (!isValid(Subject)) {
            return res.status(400).send({ status: false, message: "Subject is missing or you left empty" });
        }
        if (!isValid(Marks)) {
            return res.status(400).send({ status: false, message: "Marks is missing or you left empty" });
        }
        if (!isValid(teacherId)) {
            return res.status(400).send({ status: false, message: "Please provide teacherId" })
        }
        if (!mongoose.isValidObjectId(studentData.teacherId)) {
            return res.status(400).send({ status: false, message: " invalid teacherId length" })
        }
        let validteacherId = await teacherModel.findById(teacherId)
        if (!validteacherId) {
            return res.status(400).send({ status: false, message: "teacherId is not valid" })
        }
        const findStudent = await studentModel.findOne({ name: name, Subject: Subject, teacherId: teacherId })
        if (findStudent) {
            const updateStudent = await studentModel.findOneAndUpdate({ name: name, Subject: Subject, teacherId: teacherId }, { $inc: { Marks: Marks } }, { new: true })

            return res.status(200).send({ status: true, message: "successfully ", data: updateStudent })
        }
        const newStudent = await studentModel.create(data);
        return res.status(201).send({ status: true, message: "student created successfully", data: newStudent })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

//===========================================Get cart==============================================================

const getstudent = async function (req, res) {
    try {
        let studentdata = req.params.studentdata
        console.log(studentdata)
        if (!studentdata) {
            return res.status(400).send({ status: false, msg: "studentdata not present" })
        }
        if (!mongoose.isValidObjectId(studentdata)) {
            return res.status(400).send({ status: false, message: " invalid studentdata length" })
        }
        let findstudent = await studentModel.findOne({ studentdata })
        console.log(findstudent)
        if (!findstudent) {
            return res.status(404).send({ status: false, message: "student not found" })
        } else {
            return res.status(200).send({ status: true, message: "Success", data: findstudent })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}


// // // ---------------delete students-------------------//

const deletestu = async function (req, res) {
    try {
        let studentId = req.params.studentId;

        if (!studentId) {
            return res.status(400).send({ status: false, message: "Please provide studentId" })
        }
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: " invalid studentId length" })
        }
        let student = await studentModel.findById(studentId);
        if (!student) {
            res.status(404).send({ status: false, massege: "student doesn't exists" });
        }

        if (student.isDeleted == true) {
            res.status(404).send({ status: false, massege: "student is allready deleted" });
        } else {
            let deletestudent = await blogModel.findOneAndUpdate(
                { _id: studentId },
                { isDeleted: true },
                { new: true });
            return res.status(200).send({ status: true, msg: "student is deleted successfully", data: deletestudent, });
        }
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
};

module.exports = { createstu, getstudent, deletestu }
