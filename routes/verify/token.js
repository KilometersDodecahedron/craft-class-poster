const router = require("express").Router()
const axios = require("axios")

router.route("/test").get((req, res) => {
  res.sendStatus(300)
})

router.route("/").get((req, res) => {
  console.log("token", req.query.token)
  //   if (req.query.token) return res.send({ this: "worked" })
  // res.render(path.join(__dirname, "../views/index.handlebars"))
  res.sendStatus(300)
})

router.route("/get_refresh").post((req, res) => {
  console.log(req.body)
  res.sendStatus(300)
})

router.route("/email").post((req, res) => {
  console.log(req.body)
  axios({
    method: "post",
    url: process.env.AUTH_SERVER_VERIFICATION_ROUTE,
    data: {
      email: req.body.email,
    },
  })
    .then(response => {
      // console.log(response)
      res.send(response.data)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
})

module.exports = router
