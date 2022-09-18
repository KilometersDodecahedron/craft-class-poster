const router = require("express").Router()
const craftClassRoutes = require("./craft-class.js")
const tagRoutes = require("./tags")
const imgBBRoutes = require("./imgbb")
const categoryRoutes = require("./category")
const mediaSliderRoutes = require("./media-sliders")

router.use("/craft_class", craftClassRoutes)
router.use("/tag", tagRoutes)
router.use("/imgbb", imgBBRoutes)
router.use("/category", categoryRoutes)
router.use("/media_slider", mediaSliderRoutes)

module.exports = router
