const postTag = (_data, _callback) => {
  let postData = _data
  postData.dateCreated = Date.now()

  $.ajax({
    type: "POST",
    url: "/api/tag/create",
    dataType: "json",
    data: postData,
  })
    .then(data => {
      console.log(data)
      if (_callback) {
        _callback(data)
      }
    })
    .catch(err => console.log(err))
}

const getAllTags = callback => {
  $.ajax({
    type: "GET",
    url: "/api/tag",
    context: this,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => console.log(err))
}

const updateTag = (newData, id, callback) => {
  $.ajax({
    type: "PUT",
    url: "/api/tag/update/" + id,
    context: this,
    data: newData,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => console.log(err))
}

const deleteTag = (id, callback) => {
  $.ajax({
    type: "DELETE",
    url: "/api/tag/delete/" + id,
    context: this,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => console.log(err))
}
