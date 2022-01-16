const router = require("express").Router()
const craftClassRoutes = require("./craft-class.js")
const tagRoutes = require("./tags")

router.use("/craft_class", craftClassRoutes)
router.use("/tag", tagRoutes)

module.exports = router
