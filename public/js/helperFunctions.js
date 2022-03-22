const HELPER_convertImageFileToBase64String = (file, callback) => {
  let base64String = ""
  var reader = new FileReader()

  reader.onload = function () {
    base64String = reader.result.replace("data:", "").replace(/^.+,/, "")
    callback(base64String)
  }

  reader.readAsDataURL(file)
}
