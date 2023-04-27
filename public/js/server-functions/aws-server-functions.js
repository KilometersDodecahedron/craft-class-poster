const postImages = (_data, callback) => {
  let tracker = 0
  let target = _data.length
  let catcher = []
  _data.forEach((entry, index) => {
    fetch("/files/images/upload", {
      method: "POST",
      body: entry,
    })
      .then(response => response.json())
      .then(data => {
        data.index = index
        catcher.push(data)
        tracker++
        console.log(tracker)
        if (tracker === target) {
          catcher.sort((a, b) => (a.index > b.index ? 1 : -1))
          callback(catcher)
        }
      })
      .catch(err => console.warn(err))
  })
}

const deleteImages = (nameArray, callback) => {
  $.ajax({
    type: "DELETE",
    url: "/files/images/delete/",
    context: this,
    data: nameArray,
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
// "https://class-uploader-file-storage.s3.amazonaws.com/--1670665668694.png"
