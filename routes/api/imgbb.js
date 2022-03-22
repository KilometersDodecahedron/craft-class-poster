const router = require("express").Router()
const imgBB = require("../../controllers/imgBB_controller.js")

router.route("/test").post(imgBB.TEST_FUNCTION)

router.route("/upload").post(imgBB.uploadImageAndReturnFilepath)

// router.route("/:image/:name").post

module.exports = router
