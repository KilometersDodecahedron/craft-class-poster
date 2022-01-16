const router = require("express").Router()
const tagController = require("../../controllers/tag_controller")

router.route("/").get(tagController.getTags)

router.route("/create").post(tagController.postTag)

router.route("/update/:id").put(tagController.updateTag)

router.route("/delete/:id").delete(tagController.deleteTag)

module.exports = router
