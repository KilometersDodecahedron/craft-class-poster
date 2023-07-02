// const testButton1 = document.querySelector("#test")

const testImgRouter = () => {
  $.ajax({
    type: "GET",
    url: "/api/imgbb",
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}

const uploadImage = data => {
  // console.log(data)
  $.ajax({
    type: "POST",
    url: "/api/imgbb/upload",
    processData: false, // tell jQuery not to process the data
    contentType: false, // tell jQuery not to set contentType
    enctype: "multipart/form-data",
    data: data,
    async: true,
  })
    .then(data => {
      // console.log(data)
    })
    .catch(err => {
      console.error(err)
    })
}

// testButton1.addEventListener("click", testImgRouter)
