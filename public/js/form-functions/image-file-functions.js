const imageFileFunctions = {
  updatePhotosWarning: "Photos are already being used for another class. Please upload new photos.",
  updatePhotosWarningPopup: document.querySelector("#overlay-update-photos-warning"),
  linkPrefix: "https://class-uploader-file-storage.s3.amazonaws.com/",
  // TODO set selectors so they get the correct elements
  currentClassPhotos: [],
  nameGeneration: {
    // max char length for name section. Max total length is 75
    maxClassNameLength: 30,
    // allows only letters and numbers. No special characters
    regex: /[^A-Za-z0-9]+/g,
  },
  mainImage: {
    file: "",
    src: "",
    alt: "",
    // used to check if this is a new image
    originalClassData: {
      src: "",
      alt: "",
    },
    fileInput: document.querySelector("#image-file-input--main"),
    altInput: document.querySelector("#image-alt-input--main"),
    selectButton: document.querySelector("#image-select-button--main"),
    // added to the file input to grab the file
    captureFileFunction: e => {
      const files = e.target.files
      imageFileFunctions.mainImage.file = files[0]
      let imageUrl = URL.createObjectURL(imageFileFunctions.mainImage.file)
      imageFileFunctions.mainImage.src = imageUrl
      console.log(imageFileFunctions.mainImage)
    },
    selectButtonFunction: e => {
      if (imageFileFunctions.mainImage.src != "") {
        imageFileFunctions.mainImage.alt = imageFileFunctions.mainImage.altInput.value
        if (imageFileFunctions.mainImage.alt != "") {
          imageFileFunctions.mainImage.preview()
          changeChecker.changeFunction()
        }
      }
    },
    xButtonFunction: e => {
      if (!e.target.classList.contains("x-button--main-image")) return
      imageFileFunctions.mainImage.file = ""
      imageFileFunctions.mainImage.src = ""
      imageFileFunctions.mainImage.alt = ""
      imageFileFunctions.imagePreview.clearMain()
      changeChecker.changeFunction()
    },
    preview: () => {
      imageFileFunctions.imagePreview.clearMain()
      imageFileFunctions.imagePreview.mainHolder.appendChild(
        imageFileFunctions.imagePreview.create(
          imageFileFunctions.mainImage.src,
          imageFileFunctions.mainImage.alt
        )
      )
    },
    reset: () => {
      imageFileFunctions.mainImage.file = ""
      imageFileFunctions.mainImage.src = ""
      imageFileFunctions.mainImage.alt = ""
      imageFileFunctions.mainImage.originalClassData.src = ""
      imageFileFunctions.mainImage.originalClassData.alt = ""
      imageFileFunctions.imagePreview.clearMain()
    },
    // called from form-functions.js
    populateFromExistingClassData: _data => {
      imageFileFunctions.mainImage.reset()
      if (_data.photos.length < 1) return
      imageFileFunctions.mainImage.src = _data.photos[0].src
      imageFileFunctions.mainImage.alt = _data.photos[0].alt
      imageFileFunctions.mainImage.originalClassData.src = _data.photos[0].src
      imageFileFunctions.mainImage.originalClassData.alt = _data.photos[0].alt
      imageFileFunctions.mainImage.preview()
    },
  },
  additionalImages: {
    fileHolder: "",
    srcHolder: "",
    array: [],
    originalClassData: [],
    fileInput: document.querySelector("#image-file-input--additional"),
    altInput: document.querySelector("#image-alt-input--additional"),
    addButton: document.querySelector("#image-select-button--additional"),
    captureFileFunction: e => {
      const files = e.target.files
      imageFileFunctions.additionalImages.fileHolder = files[0]
      let imageUrl = URL.createObjectURL(imageFileFunctions.additionalImages.fileHolder)
      imageFileFunctions.additionalImages.srcHolder = imageUrl
    },
    xButtonFunction: e => {
      if (!e.target.classList.contains("x-button--additional-image")) return
      let index = parseInt(e.target.dataset.index)
      if (index == 0) {
        imageFileFunctions.additionalImages.array.shift()
      } else {
        imageFileFunctions.additionalImages.array.splice(index, index)
      }
      imageFileFunctions.additionalImages.preview()
    },
    preview: () => {
      imageFileFunctions.imagePreview.clearAdditional()
      for (let i = 0; i < imageFileFunctions.additionalImages.array.length; i++) {
        imageFileFunctions.imagePreview.additionalHolder.appendChild(
          imageFileFunctions.imagePreview.create(
            imageFileFunctions.additionalImages.array[i].src,
            imageFileFunctions.additionalImages.array[i].alt,
            true,
            i
          )
        )
      }
      changeChecker.changeFunction()
    },
    reset: () => {
      imageFileFunctions.additionalImages.fileHolder = ""
      imageFileFunctions.additionalImages.srcHolder = ""
      imageFileFunctions.additionalImages.array = []
      imageFileFunctions.additionalImages.originalClassData = []
      imageFileFunctions.imagePreview.clearAdditional()
    },
    addButtonFunction: e => {
      if (
        imageFileFunctions.additionalImages.altInput.value != "" &&
        imageFileFunctions.additionalImages.srcHolder != ""
      ) {
        let newImageData = {}
        newImageData.file = imageFileFunctions.additionalImages.fileHolder
        newImageData.src = imageFileFunctions.additionalImages.srcHolder
        newImageData.alt = imageFileFunctions.additionalImages.altInput.value
        imageFileFunctions.additionalImages.array.push(newImageData)
        imageFileFunctions.additionalImages.preview()
        imageFileFunctions.additionalImages.fileHolder = ""
        imageFileFunctions.additionalImages.srcHolder = ""
      }
    },
    populateFromExistingClassData: _data => {
      imageFileFunctions.additionalImages.reset()
      for (let i = 1; i < _data.photos.length; i++) {
        let newImageData = {
          file: "",
          src: _data.photos[i].src,
          alt: _data.photos[i].alt,
        }
        imageFileFunctions.additionalImages.array.push(newImageData)
        imageFileFunctions.additionalImages.originalClassData.push(newImageData)
      }
      imageFileFunctions.additionalImages.preview()
    },
  },
  imagePreview: {
    template: document.querySelector("#image-preview-template"),
    mainHolder: document.querySelector("#main-card-holder"),
    additionalHolder: document.querySelector("#additional-card-holder"),
    create: (_src, _alt, isAdditional, _index) => {
      let newElement = imageFileFunctions.imagePreview.template.content.cloneNode(true)
      let image = newElement.querySelector(".image-preview")
      image.setAttribute("src", _src)
      image.setAttribute("alt", _alt)
      let altDisplay = newElement.querySelector(".card-text")
      altDisplay.innerHTML = _alt

      let xButton = newElement.querySelector(".x-button")
      if (isAdditional) {
        xButton.classList.add("x-button--additional-image")
        xButton.dataset.index = _index
      } else {
        xButton.classList.add("x-button--main-image")
      }
      return newElement
    },
    clearMain: () => {
      imageFileFunctions.mainImage.fileInput.value = ""
      imageFileFunctions.mainImage.altInput.value = ""
      imageFileFunctions.imagePreview.mainHolder.innerHTML = ""
    },
    clearAdditional: () => {
      imageFileFunctions.additionalImages.fileInput.value = ""
      imageFileFunctions.additionalImages.altInput.value = ""
      imageFileFunctions.imagePreview.additionalHolder.innerHTML = ""
    },
  },
  updatePhotosWarning: {
    text: "Photos are already being used for another class. Please upload new photos.",
    popup: document.querySelector("#overlay-update-photos-warning"),
    message: document.querySelector("#overlay-update-photos-warning-message"),
    button: document.querySelector("#overlay-update-photos-warning-btn"),
    checkForMissingFilesMethod: _fileArray => {
      let noMissingFiles = true
      _fileArray.every(file => {
        if (file == "") {
          classForm.hideOverlay()
          imageFileFunctions.updatePhotosWarning.popup.classList.remove("d-none")
          noMissingFiles = false
          return false
        }
        return true
      })

      return noMissingFiles
    },
    buttonFunction: () => {
      imageFileFunctions.updatePhotosWarning.popup.classList.add("d-none")
    },
  },
  startFunctions: () => {
    imageFileFunctions.mainImage.fileInput.addEventListener(
      "change",
      imageFileFunctions.mainImage.captureFileFunction
    )
    imageFileFunctions.mainImage.selectButton.addEventListener(
      "click",
      imageFileFunctions.mainImage.selectButtonFunction
    )
    imageFileFunctions.additionalImages.fileInput.addEventListener(
      "change",
      imageFileFunctions.additionalImages.captureFileFunction
    )
    imageFileFunctions.additionalImages.addButton.addEventListener(
      "click",
      imageFileFunctions.additionalImages.addButtonFunction
    )
    imageFileFunctions.updatePhotosWarning.button.addEventListener(
      "click",
      imageFileFunctions.updatePhotosWarning.buttonFunction
    )
    imageFileFunctions.updatePhotosWarning.message.innerHTML =
      imageFileFunctions.updatePhotosWarning.text
    document.addEventListener("click", imageFileFunctions.mainImage.xButtonFunction)
    document.addEventListener("click", imageFileFunctions.additionalImages.xButtonFunction)
  },
  resetEverything: () => {
    imageFileFunctions.mainImage.reset()
    imageFileFunctions.additionalImages.reset()
  },
  postImagesToServer: (files, optionalCallback) => {
    let processedData = []
    files.forEach((item, index) => {
      let formData = new FormData()
      formData.append("image", item)
      formData.append("newName", imageFileFunctions.generateUniqueFileName(item.name, index))
      processedData.push(formData)
    })
    if (optionalCallback) {
      postImages(processedData, optionalCallback)
    } else {
      postImages(processedData, response => {
        // TODO send this data to the database
        console.log(response)
      })
    }
  },
  deleteImagesFromServer: (nameArray, callback) => {
    deleteImages(nameArray, response => {
      if (callback) {
        callback(response)
      }
    })
  },
  generateUniqueFileName: (_originalFileName, _index) => {
    let [fileName, fileType] = _originalFileName.split(".")
    // removes special characters
    let className = classForm.classNameInput.value
    // class name + original file name + date created
    let newFileName =
      className
        .replace(imageFileFunctions.nameGeneration.regex, "")
        .substring(
          0,
          Math.min(className.length, imageFileFunctions.nameGeneration.maxClassNameLength)
        ) +
      "-" +
      fileName
        .replace(imageFileFunctions.nameGeneration.regex, "")
        .substring(
          0,
          Math.min(className.length, imageFileFunctions.nameGeneration.maxClassNameLength)
        ) +
      "-" +
      Date.now() +
      `${_index != "" ? _index + "." : "."}` +
      fileType
    newFileName = newFileName.split(" ").join("")

    // TODO check against array that there isn't another file with this exact name
    console.log(newFileName)
    return newFileName
  },
  // TODO call from form-functions.js
  manageImageFilesBeforeClassData: (_method, _data, _callback, _classID) => {
    //
    if (_method == "create") {
      // TODO check photos
      let photosToPost = []
      let photoObjectsArray = []
      photosToPost.push(imageFileFunctions.mainImage.file)
      imageFileFunctions.additionalImages.array.forEach((item, index) => {
        photosToPost.push(item.file)
      })
      if (imageFileFunctions.updatePhotosWarning.checkForMissingFilesMethod(photosToPost)) {
        imageFileFunctions.postImagesToServer(photosToPost, imageServerResponse => {
          imageServerResponse.forEach((item, index) => {
            let newPhotoObject = {}
            newPhotoObject.src = item.Location
            if (index === 0) {
              newPhotoObject.alt = imageFileFunctions.mainImage.alt
            } else {
              newPhotoObject.alt = imageFileFunctions.additionalImages.array[index - 1].alt
            }
            photoObjectsArray.push(newPhotoObject)
          })
          _data.photos = photoObjectsArray
          postClass(_data, _callback)
        })
      }
    } else if (_method == "update") {
      console.log("update")
      let hasMainImageAlready = false
      let photosToPost = []
      let photosToDelete = []
      let photoObjectsArray = []
      // store indexes of new photos here, so they can be sorted back in when done
      let newPhotoIndexArray = []
      // main image
      if (imageFileFunctions.mainImage.src == imageFileFunctions.mainImage.originalClassData.src) {
        hasMainImageAlready = true
        let oldPhoto = {
          src: imageFileFunctions.mainImage.src,
          alt: imageFileFunctions.mainImage.alt,
        }
        photoObjectsArray.push(oldPhoto)
      } else {
        newPhotoIndexArray.push(0)
        photosToPost.push(imageFileFunctions.mainImage.file)
        // only delete photos actually stored on DB
        if (
          imageFileFunctions.mainImage.originalClassData.src.includes(imageFileFunctions.linkPrefix)
        ) {
          photosToDelete.push(imageFileFunctions.mainImage.originalClassData.src)
        }
      }
      if (imageFileFunctions.additionalImages.array.length > 0) {
        // additional photos to add or keep
        imageFileFunctions.additionalImages.array.forEach((arrayItem, arrayIndex) => {
          let needsToBeAdded = true
          imageFileFunctions.additionalImages.originalClassData.forEach(
            (originalItem, originalIndex) => {
              if (originalItem.src == arrayItem.src) {
                needsToBeAdded = false
              }
            }
          )
          if (needsToBeAdded) {
            newPhotoIndexArray.push(arrayIndex + 1)
            photosToPost.push(arrayItem.file)
          } else {
            let oldPhoto = {
              src: arrayItem.src,
              alt: arrayItem.alt,
            }
            photoObjectsArray.push(oldPhoto)
          }
        })
      }
      if (imageFileFunctions.additionalImages.originalClassData.length > 0) {
        // additional photos to delete
        imageFileFunctions.additionalImages.originalClassData.forEach(
          (originalItem, originalIndex) => {
            let needsToBeDeleted = true
            imageFileFunctions.additionalImages.array.forEach((arrayItem, arrayIndex) => {
              if (originalItem.src == arrayItem.src) {
                needsToBeDeleted = false
              }
            })
            if (
              needsToBeDeleted &&
              imageFileFunctions.mainImage.originalClassData.src.includes(
                imageFileFunctions.linkPrefix
              )
            ) {
              photosToDelete.push(originalItem.src)
            }
          }
        )
      }
      if (photosToPost.length > 0) {
        imageFileFunctions.postImagesToServer(photosToPost, imageServerResponse => {
          imageServerResponse.forEach((item, index) => {
            let newPhotoObject = {}
            newPhotoObject.src = item.Location
            if (index === 0 && !hasMainImageAlready) {
              newPhotoObject.alt = imageFileFunctions.mainImage.alt
            } else {
              newPhotoObject.alt =
                imageFileFunctions.additionalImages.array[newPhotoIndexArray[index] - 1].alt
            }

            photoObjectsArray.splice(newPhotoIndexArray[index], 0, newPhotoObject)
          })
          _data.photos = photoObjectsArray
          console.log(_data.photos)
          updateClass(_data, _classID, _callback)
          if (photosToDelete.length > 0) {
            imageFileFunctions.deleteImagesFromServer({ nameArray: photosToDelete })
          }
        })
      } else if (photosToDelete.length > 0) {
        imageFileFunctions.deleteImagesFromServer({ nameArray: photosToDelete })
        _data.photos = photoObjectsArray
        updateClass(_data, _classID, _callback)
      } else {
        updateClass(_data, _classID, _callback)
      }
    } else if (_method == "delete") {
      console.log("delete")
      let photosToDelete = []
      console.log(_data.photos)
      _data.photos.forEach(entry => {
        if (entry.src.includes(imageFileFunctions.linkPrefix)) {
          photosToDelete.push(entry.src)
        }
      })
      if (photosToDelete.length > 0) {
        let formattedDeleteObject = { nameArray: photosToDelete }
        console.log(formattedDeleteObject)

        imageFileFunctions.deleteImagesFromServer(formattedDeleteObject, response => {
          console.log(response)
          deleteClass(_classID, _callback)
        })
      } else {
        deleteClass(_classID, _callback)
      }
    } else {
      console.warn("No valid method given")
    }
  },
  setCurrentClassPhotos: _class => {
    let photos = _class.photos
    imageFileFunctions.currentClassPhotos = [...photos]
    let main = photos.shift()
    // note this give you a link to the file, not the file
    imageFileFunctions.mainImage.src = main.src
    imageFileFunctions.mainImage.alt = main.alt
    imageFileFunctions.additionalImages.array = [...photos]
    console.log(imageFileFunctions.currentClassPhotos)
    console.log(imageFileFunctions.mainImage)
    console.log(imageFileFunctions.additionalImages)
  },
  resetFunction: () => {
    imageFileFunctions.mainImage.reset()
    imageFileFunctions.additionalImages.reset()
  },
}
