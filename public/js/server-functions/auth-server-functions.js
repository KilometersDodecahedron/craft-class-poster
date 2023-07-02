// called by login-form.js
const sendEmailToAuthServer = _email => {
  $.ajax({
    type: "POST",
    // url: "/test/server",
    url: "/verify/token/email",
    data: {
      email: _email,
    },
  })
    .then(data => {
      // console.log(data)
    })
    .catch(err => {
      console.warn(err)
    })
}
