const path = require("path")
const router = require("express").Router()
const apiRoutes = require("./api")
const fileRoutes = require("./files")
const verifyRoutes = require("./verify")
const express = require("express")

const tokens = require("../tokens")

// JWT authentication
const jwt = require("jsonwebtoken")

router.use("/verify", verifyRoutes)
router.use("/api", apiRoutes)
router.use("/files", fileRoutes)
//
router.use("/static_images__primary", express.static("primary"))
router.use("/static_images__secondary", express.static("secondary"))

router.use("/login", function (req, res) {
  // res.render(path.join(__dirname, "../views/index.handlebars"))
  res.render(path.join(__dirname, "../views/login.handlebars"))
})

router.use(function (req, res) {
  console.log(req.query.token)
  let token = req.query.token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // tells user token isn't valid
    if (err) {
      console.log("not verified")
      res.render(path.join(__dirname, "../views/login.handlebars"))
    } else {
      console.log("verified")
      res.render(path.join(__dirname, "../views/index.handlebars"))
    }
  })

  // if (1 == 1) {
  //   res.render(path.join(__dirname, "../views/index.handlebars"))
  // } else {
  //   res.render(path.join(__dirname, "../views/login.handlebars"))
  // }
  // res.render(path.join(__dirname, "../views/login.handlebars"))
})

module.exports = router
