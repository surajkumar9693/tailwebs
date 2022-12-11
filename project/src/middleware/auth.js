const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const teacherModel = require("../models/teacherModel");
const studentModel = require("../models/studentModel");

// --------------Authentication------------

const authenticate = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(404).send({ status: false, msg: "missing a mandatory token" });

    let decodedToken = jwt.verify(token, "tailwebs", (err, decode)=>{
      if (err){
          return res.status(401).send({status: false, msg:"You have enter invalid token"})
      }(decode == true)
      next()
    })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.messge }); 
  }
};

//---------------------Authorization---------------------

const authorization = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"]; 
    if (!token)
      res.status(401).send({ status: false, msg: "missing a mandatory token" });
    let decodedToken = jwt.verify(token, "tailwebs");
    let teacehLoggedIn = decodedToken.teacherId;
    let student = req.params.studentId
    if (!mongoose.isValidObjectId(student)){
      return res.status(400).send({ status: false, msg: 'Please enter correct student Id' })
  }
    let studentData = await studentModel.findOne({ _id: student });
    
    if (studentData.studentId.toString() != teacehLoggedIn) {
      return res.status(403).send({ status: false, msg: "You are not authrized" });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};


module.exports = { authenticate, authorization }