const jwt = require('jsonwebtoken')
const teacherModel = require("../models/teacherModel")



//===================================Authentication======================================================


const authentication = async function (req, res, next) {
  try {
      token = req.headers['x-api-key']
      if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }
      decodedToken = jwt.verify(token, "tailwebs", (err, decode) => {
          if (err) {
              return res.status(400).send({ status: false, message: "Token is not correct!" })
          }
          req.decode = decode

          next()
      })
  } catch (error) {
      res.status(500).send({ status: false, message: error.message })
  }
}
//===================================Authorization======================================================
const authorization = async function (req, res, next) {
  try {
      let teacherId = req.params.teacherId

      let Checking = await teacherModel.findOne({ _id: teacherId })
      if (!Checking) {
          return res.status(404).send({ status: false, message: "this teacher is not found" })
      }
      if (Checking.teacherId != req.decode.teacherId) {
          return res.status(403).send({ status: false, message: "you are not Authorized person" })
      }
      else {
          next()
      }
  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { authentication, authorization }