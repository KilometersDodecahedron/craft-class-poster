const loginForm = document.querySelector("#login-form")
const emailInput = document.querySelector("#inputEmail")
const checkEmailMessage = document.querySelector("#message")

loginForm.addEventListener("submit", e => {
  e.preventDefault()
  sendEmailToAuthServer(emailInput.value)
  checkEmailMessage.classList.remove("d-none")
})

// console.log(sendEmailToAuthServer)
