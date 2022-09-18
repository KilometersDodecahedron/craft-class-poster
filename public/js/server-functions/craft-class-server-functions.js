const postClass = (_data, callback) => {
  let postData = _data
  postData.dateCreated = Date.now()

  $.ajax({
    type: "POST",
    url: "/api/craft_class/create",
    dataType: "json",
    data: postData,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => {
      console.warn(err)
      callback()
    })
}

const getAllClasses = callback => {
  $.ajax({
    type: "GET",
    url: "/api/craft_class",
    context: this,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => {
      console.warn(err)
      callback()
    })
}

const updateClass = (newData, id, callback) => {
  $.ajax({
    type: "PUT",
    url: "/api/craft_class/update/" + id,
    context: this,
    data: newData,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => {
      console.warn(err)
      callback()
    })
}

const deleteClass = (id, callback) => {
  $.ajax({
    type: "DELETE",
    url: "/api/craft_class/delete/" + id,
    context: this,
  })
    .then(data => {
      console.log(data)
      if (callback) {
        callback(data)
      }
    })
    .catch(err => {
      console.warn(err)
      callback()
    })
}

var testingClassData = undefined
const newVideoData = {
  name: "Second Test",
}
