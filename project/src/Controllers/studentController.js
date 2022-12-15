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
        const newStudent = await studentModel.create(studentData);
        return res.status(201).send({ status: true, message: "student created successfully", data: newStudent })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

//===========================================Get cart=====================================================

const getstudent = async function (req, res) {
    try {
        let queries = req.query

        let Student = await studentModel.find({ isDeleted: false })

        if (Student.length == 0) {
            return res.status(404).send({ status: false, message: "No product found" })
        }
        if (queries) {
            if (queries.name && queries.subject) { 
                let combination = await studentModel.find({ name: { $regex: queries.name }, subject: { $regex: queries.subject } })
                return combination.length == 0 ? res.status(404).send({ status: false, message: "No student found" }) : res.status(200).send({ status: true, message: "Success", data: combination })

            }
        }
        if (queries.name) {
            let getbyName = await studentModel.find({ isDeleted: false, name: { $regex: queries.name } })
            return getbyName.length == 0 ? res.status(404).send({ status: false, message: "No name found" }) : res.status(200).send({ status: true, message: "Success", data: getbyName })

        }
        if (queries.subject) {
            let getbySubject = await studentModel.find({ isDeleted: false, subject: { $regex: queries.subject } })
            return getbySubject.length == 0 ? res.status(404).send({ status: false, message: "No subject found" }) : res.status(200).send({ status: true, message: "Success", data: getbySubject })

        }

        return res.status(200).send({ status: false, message: "Success", data: Student })
    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })

    }
}


//========================================= updatestudent ================================================

const updatestudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        let teacherId = req.params.teacherId
        let data = req.body

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: " invalid studentId length" })
        }
        let findstudentId = await studentModel.findById(studentId)

        if (!findstudentId) {
            return res.status(404).send({ status: false, msg: "studentId doesn't exists" })
        }

        if (findstudentId.teacherId != teacherId) {
            return res.status(404).send({ status: false, message: "teacher not authorized" })
        }

        let upadateData = await studentModel.findByIdAndUpdate(
            { _id: studentId, isDeleted: false },
            data,
            { new: true }
        )
        return res.status(200).send({ status: true, message: "Student details updated successfully", data: upadateData })

    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



// // // ---------------delete students-------------------//

const deletestu = async function (req, res) {
    try {
        let studentId = req.params.studentId;
        let teacherId = req.params.teacherId;

        if (!studentId) {
            return res.status(400).send({ status: false, message: "Please provide studentId" })
        }
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: " invalid studentId length" })
        }
        let student = await studentModel.findById({_id:studentId});
        if (!student) {
            res.status(404).send({ status: false, massege: "student doesn't exists" });
        }

        if (student.teacherId != teacherId) {
            return res.status(404).send({ status: false, message: "teacher not authorized" })
        }
            
        let deletestudent = await studentModel.findOneAndUpdate(
                { _id: studentId },
                { isDeleted: true },
                { new: true });
        return res.status(200).send({ status: true, msg: "student is deleted successfully", data: deletestudent, });
        
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
};

module.exports = { createstu, getstudent, updatestudent, deletestu }
