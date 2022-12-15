const express = require('express');
const router = express.Router();
const teacherController = require("../controllers/teacherController")
const studentController = require("../controllers/studentController")
const middleware = require("../middleware/auth.js")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/teachercreate", teacherController.teachercreate)
router.post("/login", teacherController.login)
router.post("/createstu", studentController.createstu)
router.get("/getstudent", studentController.getstudent)
router.put("/updatestudent/:teacherId/:studentId", middleware.authentication, middleware.authorization, studentController.updatestudent)
router.delete("/deletestu/:teacherId/:studentId", middleware.authentication, middleware.authorization, studentController.deletestu)

module.exports = router;

