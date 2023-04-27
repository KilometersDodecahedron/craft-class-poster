const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  // "authHeader &&" means it only returns the value if the token exists
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  // pass it the same secret you hashed the token with to verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // tells user token isn't valid
    if (err) return res.sendStatus(403)
    req.user = user
    // move on from the middleware
    next()
  })
}

function testHeaders(req, res, next) {
  const authHeader = req.headers["authorization"]
  console.log(authHeader)
  const token = authHeader && authHeader.split(" ")[1]
  console.log(token)
  next()
}

function testSessionStorage(req, res, next) {
  console.log(req.headers)
  // console.log("1")
  next()
}

function testMiddleware(req, res, next) {
  // if (req.body.password === 12345) {
  //   next()
  // } else {
  //   return res.sendStatus(403)
  // }
  next()
}

module.exports = {
  authenticateToken,
  testMiddleware,
  testHeaders,
  testSessionStorage,
}
