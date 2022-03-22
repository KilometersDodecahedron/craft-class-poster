const router = require("express").Router()
const craftClassRoutes = require("./craft-class.js")
const tagRoutes = require("./tags")
const imgBBRoutes = require("./imgbb")

router.use("/craft_class", craftClassRoutes)
router.use("/tag", tagRoutes)
router.use("/imgbb", imgBBRoutes)

module.exports = router
