const mongoose = require("mongoose");
const teacherModel = require("../models/teacherModel");
const jwt = require("jsonwebtoken");

//------------------------Authour Creation---------------------//

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const teachercreate = async function (req, res) {
    try {
        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

        let teacherData = req.body;

        if (Object.keys(teacherData).length === 0) {
            return res.status(400).send({ status: false, message: "Please give some data" });
        }
        if (!isValid(teacherData.name)) {
            return res.status(400).send({ status: false, message: "name is missing or you left empty" });
        }
        if (!/^[a-z ,.'-]+$/i.test(teacherData.name)) {
            return res.status(400).send({ status: false, message: "name should be in alphabate", });
        }
        if (!isValid(teacherData.email)) {
            return res.status(400).send({ status: false, message: "email is missing or you left empty" });
        }
        if (!teacherData.email.match(emailRegex)) {
            return res.status(400).send({ status: false, msg: "Invalid format of email" })
        }
        const dbemail = await teacherModel.findOne({ email: teacherData.email });
        if (dbemail) {
            return res.status(400).send({ status: false, message: "email is already used" });
        }
        if (!isValid(teacherData.password)) {
            return res.status(400).send({ status: false, message: "password is missing or you left empty" });
        }
        if (!Number(teacherData.password)) {
            return res.status(400).send({ status: false, message: "password is only in number" });
        }
        if (teacherData.password.length < 4 || teacherData.password.length >= 10) {
            return res.status(400).send({ status: false, msg: "password length should be 4 to 10" })
        }
        let savedata = await teacherModel.create(teacherData);
        return res.status(201).send({ msg: savedata });
    } catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message });
    }
};

//--------------------------|| LOGIN USERS ||--------------------------------

const login = async function (req, res) {
    try {
        let { email, password } = req.body

        if (!email) {
            return res.status(400).send({
                status: false, message: "EmailId is mandatory"
            })
        }
        if (!password) {
            return res.status(400).send({
                status: false, message: "Password is mandatory"
            })
        }
        let DataChecking = await teacherModel.findOne({ email: email, password: password })
        if (!DataChecking) {
            return res.status(404).send({ msg: "Please enter valid email or password" })
        }
        let token = jwt.sign(
            {
                userId: DataChecking._id.toString(),
                batch: "Plutonium",
                organisation: "Function-up"
            },
            "tailwebs", {
            expiresIn: '10h' // expires in 1m minits
        });
        return res.status(201).send({ status: true, message: token })
    }
    catch (error) {
        res.status(500).send({
            status: false, message: error.message
        })
    }
}
module.exports.teachercreate = teachercreate,
module.exports.login = login;
