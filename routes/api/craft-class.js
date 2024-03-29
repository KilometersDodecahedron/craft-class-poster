const router = require("express").Router()
const classController = require("../../controllers/class_controller.js")

router.route("/").get(classController.getAllClasses)

router.route("/create").post(classController.postClass)

router.route("/update_tags").put(classController.updateClassTag)

router.route("/update_categories").put(classController.updateClassCategory)

router.route("/update/:id").put(classController.updateClass)

router.route("/delete/:id").delete(classController.deleteClass)

module.exports = router
