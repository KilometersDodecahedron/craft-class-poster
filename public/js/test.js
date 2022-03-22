const testButton = document.querySelector("#test")
const testPictureUpload = document.querySelector(".test-pitcure-upload")
const testPicInput = testPictureUpload.querySelector("input")
const testNameInput = testPictureUpload.querySelector("#testOther")
// const testPathImage = document.querySelector("#test-path")
const imgSubmitButton = document.querySelector("#img-submit-button")
const testForm = document.querySelector("#test-form")

// console.log(testPictureUpload.querySelector("input"))

testButton.addEventListener("click", () => {
  HELPER_convertImageFileToBase64String(testPicInput.files[0], data => {
    uploadImage("Test", testPicInput.files[0])
  })
})

imgSubmitButton.addEventListener("click", e => {
  const formData = new FormData()
  formData.append("image", testPicInput.files[0])
  formData.append("name", testNameInput.value)
  const otherFormData = {
    image: testPicInput.files[0],
    name: testNameInput.value,
  }
  // console.log(otherFormData)
  uploadImage(otherFormData)
})
