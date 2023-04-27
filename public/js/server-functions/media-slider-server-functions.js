const getAllFeatured = callback => {
  $.ajax({
    type: "GET",
    url: "/api/media_slider",
    context: this,
  })
    .then(data => {
      // console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => {
      console.warn(err)
      callback()
    })
}

const postFeatured = (_data, callback) => {
  $.ajax({
    type: "POST",
    url: "/api/media_slider/create",
    dataType: "json",
    data: _data,
  })
    .then(data => {
      // console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => {
      console.warn(err)
      callback()
    })
}

const deleteAllFeatured = callback => {
  $.ajax({
    type: "DELETE",
    url: "/api/media_slider/deleteall",
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
