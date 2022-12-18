const router = require("express").Router()
const imageRoutes = require("./images.js")

router.use("/images", imageRoutes)

module.exports = router
