const router = require("express").Router()
const mediaSliderController = require("../../controllers/media_slider_controller.js")

router.route("/").get(mediaSliderController.getAllFeatured)

router.route("/create").post(mediaSliderController.postFeatured)

router.route("/update/:id").put(mediaSliderController.updateFeatured)

router.route("/delete/:id").delete(mediaSliderController.deleteFeatured)

router.route("/deleteall").delete(mediaSliderController.deleteAllFeatured)

module.exports = router
