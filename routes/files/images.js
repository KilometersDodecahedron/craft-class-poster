const router = require("express").Router()
const path = require("path")
// 1
const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images")
  },
  // have to give file a unique name to prevent errors
  filename: (req, file, callback) => {
    console.log(file)
    callback(null, Date.now() + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })
// 2
const primary = multer({ dest: "primary/" })
const secondary = multer({ dest: "secondary/" })
const fs = require("fs")

// connect to Amazon Web Services
const S3 = require("aws-sdk/clients/s3")

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({ region, accessKeyId, secretAccessKey })

router.route("/primary").post(primary.single("uploaded_file"), (req, res) => {
  // 4
  const imagePath = req.file.path
  const description = req.body.description

  // Save this data to a database probably

  console.log(description, imagePath)
  res.send({ description, imagePath })
})

router.route("/secondary").post(secondary.single("uploaded_file"), (req, res) => {
  // 4
  const imagePath = req.file.path
  const description = req.body.description

  // Save this data to a database probably

  console.log(description, imagePath)
  res.send({ description, imagePath })
})

router.route("/storemain").post((req, res) => {
  const filePath = "primary/" + req.body.newName
  console.log(req.body.newName)

  fs.writeFile(filePath, req.files.image.path, (err, data) => {
    console.log(data)
    res.send(req.body)
  })
})

router.route("/upload").post((req, res) => {
  const image = req.files.image
  const newName = req.body.newName
  uploadImageFunction(image, newName, (err, data) => {
    console.log(data)
    res.send(data)
  })
  // res.send(files)
})

router.route("/delete").delete((req, res) => {
  console.log(req.params)
  console.log(req.body)
  console.log(req.files)
  const names = req.body.nameArray
  deleteImagesFunction(names, (err, data) => {
    if (err) res.send(err)
    res.send(data)
  })
})

module.exports = router

// upload a file to s3
const uploadImageFunction = (file, newName, callback) => {
  const fileStream = fs.createReadStream(file.path)
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: newName,
  }
  s3.upload(uploadParams, callback)
}

const deleteImagesFunction = (nameArray, callback) => {
  console.log(nameArray)
  const objects = []
  nameArray.forEach(name => {
    // remove location to get the file key
    let realName = name.split("https://class-uploader-file-storage.s3.amazonaws.com/").pop()
    let newObject = {
      Key: realName,
    }
    objects.push(newObject)
  })
  const bucketParams = {
    Bucket: bucketName,
    Delete: {
      Objects: objects,
    },
  }
  console.log(bucketParams)

  s3.deleteObjects(bucketParams, callback)
}

// https://iamsohail.medium.com/how-to-upload-multiple-files-parallelly-to-amazon-s3-3b9ac3630806
async function uploadFile(fileName, fileKey) {
  return new Promise(async function (resolve, reject) {
    const params = {
      Bucket: bucketName, // pass your bucket name
      Key: fileKey,
      Body: fs.createReadStream(fileName.path),
      ContentType: fileName.type,
    }

    await s3.upload(params, function (s3Err, data) {
      if (s3Err) {
        reject(s3Err)
      }
      console.log(`File uploaded successfully at ${data.Location}`)
      resolve(data.Location)
    })
  })
}
