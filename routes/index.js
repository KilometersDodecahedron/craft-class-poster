const path = require("path")
const router = require("express").Router()
const apiRoutes = require("./api")
const fileRoutes = require("./files")
const express = require("express")

router.use("/api", apiRoutes)
router.use("/files", fileRoutes)
//
router.use("/static_images__primary", express.static("primary"))
router.use("/static_images__secondary", express.static("secondary"))

router.use(function (req, res) {
  res.render(path.join(__dirname, "../views/index.handlebars"))
})

module.exports = router
