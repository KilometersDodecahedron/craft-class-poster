const testButton = document.querySelector("#test-connection")

const testPost = () => {
  $.ajax({
    type: "POST",
    url: "/api/tag/create",
    dataType: "json",
    data: testTagData,
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))
}

const testGet = () => {
  $.ajax({
    type: "GET",
    url: "/api/tag",
    context: this,
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))
}

// you don't need the : in the url
const testGetByID = () => {
  $.ajax({
    type: "GET",
    url: "/api/test/61b10e618e8e4f336c9971bc",
    context: this,
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))
}

const testUpdate = () => {
  $.ajax({
    type: "PUT",
    url: "/api/tag/update/61b3a613e65f697b4a5c8bb2",
    context: this,
    data: { name: "not first" },
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))
}

const testDelete = () => {
  $.ajax({
    type: "DELETE",
    url: "/api/tag/delete/61b3a613e65f697b4a5c8bb2",
    context: this,
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))
}

// testButton.addEventListener("click", testPost)
