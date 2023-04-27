const router = require("express").Router()
const tokenRoutes = require("./token.js")

router.use("/token", tokenRoutes)

module.exports = router
