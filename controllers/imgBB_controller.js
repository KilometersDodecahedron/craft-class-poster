const express = require("express")
const router = express.Router()
const axios = require("axios")
const imgbbUploader = require("imgbb-uploader")
// for .env variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// const imgbbUploader = require("imgbb-uploader")
// const uploadImageAndReturnFilepath = (req, res) => {
//   axios
//     .post("https://api.imgbb.com/1/upload" + process.env.API_KEY, formData)
//     .then(response => {
//       callback(response)
//     })
//     .catch(err => {
//       console.error(err)
//     })
// }
const uploadImageAndReturnFilepath = (req, res) => {
  console.log(req.body)
  // axios
  //   .post("https://api.imgbb.com/1/upload" + process.env.API_KEY, req.body)
  //   .then(response => {
  //     res.json(response)
  //   })
  //   .catch(err => {
  //     console.error(err)
  //   })

  // axios({
  //   method: "POST",
  //   url: "https://api.imgbb.com/1/upload" + process.env.API_KEY,
  //   data: req.params,
  // })
}

const TEST_FUNCTION = () => {
  console.log("TEST_FUNCTION was called successfully")
}

module.exports = { uploadImageAndReturnFilepath, TEST_FUNCTION }
