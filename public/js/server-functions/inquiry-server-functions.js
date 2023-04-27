const testButton3 = document.querySelector("#test-connection-inquiry")

const postInquiry = (_data, _callback) => {
  $.ajax({
    type: "POST",
    url: "/api/inquiry/create",
    dataType: "json",
    data: _data,
  })
    .then(data => {
      // console.log(data)
      if (_callback) {
        _callback(data)
      }
    })
    .catch(err => console.warn(err))
}

const getAllInquiries = callback => {
  $.ajax({
    type: "GET",
    url: "/api/inquiry",
    context: this,
  })
    .then(data => {
      // console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => console.log(err))
}

const updateInquiry = (newData, id, callback) => {
  $.ajax({
    type: "PUT",
    url: "/api/inquiry/update/" + id,
    context: this,
    data: newData,
  })
    .then(data => {
      // console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => console.log(err))
}

const deleteInquiry = (id, callback) => {
  $.ajax({
    type: "DELETE",
    url: "/api/inquiry/delete/" + id,
    context: this,
  })
    .then(data => {
      // console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => console.log(err))
}

// testButton3.addEventListener("click", () => {
//   getAllInquiries()
//     updateInquiry({ ageGroup: "Adult" }, "61df2e638850eca6049658b7")
//     deleteInquiry("61df2e638850eca6049658b7")
// })
