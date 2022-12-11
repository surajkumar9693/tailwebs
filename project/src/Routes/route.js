const express = require('express');
const router = express.Router();
const teacherController= require("../controllers/teacherController")
const studentController= require("../controllers/studentController")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
}) 

router.post("/teachercreate", teacherController.teachercreate)
router.post("/login", teacherController.login)
router.post("/createstu", studentController.createstu)
router.get("/getstudent", studentController.getstudent)
router.delete("/deletestu/:studentId", studentController.deletestu)

module.exports = router; 

