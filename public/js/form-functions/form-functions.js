const classLoaderForm = {
  currentClassID: "",
  classLoaderDropdownHolder: document.querySelector("#class-loader-dropdown-holder"),
  newClassButton: document.querySelector("#new-class-button"),
  currentClassDisplayName: document.querySelector("#current-class-display").querySelector("span"),
  templateClassDropdownOpen: document.querySelector("#template-class-dropdown-option"),
  newClassButtonFunction: () => {
    // TODO reset current class
    classLoaderForm.resetClassID()
    tagForm.removeAllTags()
    imageForm.resetInputFields()
    classForm.resetInputFields()
    warning.resetWarnings()
  },
  resetClassID: () => {
    classLoaderForm.currentClassID = ""
    classLoaderForm.currentClassDisplayName.innerHTML = "None"
    classForm.updateButton.disabled = true
    classForm.deleteButton.disabled = true
  },
  enableButtonFunctions: () => {
    classLoaderForm.newClassButton.addEventListener("click", classLoaderForm.newClassButtonFunction)
  },
}

const tagForm = {
  selectedTagList: [],
  totalTagList: [],
  select: document.querySelector("#tag-select"),
  submit: document.querySelector("#tag-submit"),
  delete: document.querySelector("#tag-delete"),
  displayHolder: document.querySelector("#tag-selected--holder"),
  tagDisplayTemplate: document.querySelector("#template-tag-selected"),
  fetchTotalTags: () => {
    getAllTags(data => {
      tagForm.totalTagList = data
      tagForm.populateOptions()
    })
  },
  populateOptions: () => {
    let optionListHolder = tagForm.select.querySelector(".form-select")
    let optionDeleteHolder = tagForm.delete.querySelector(".form-select")
    optionListHolder.innerHTML = ""
    optionDeleteHolder.innerHTML = ""

    let placeholderOption = document.createElement("option")
    placeholderOption.innerHTML = "Choose..."
    placeholderOption.value = "Choose..."
    optionListHolder.append(placeholderOption)

    let placeholderOptionDelete = document.createElement("option")
    placeholderOptionDelete.innerHTML = "Choose..."
    placeholderOptionDelete.value = "Choose..."
    optionDeleteHolder.append(placeholderOptionDelete)

    for (let i = 0; i < tagForm.totalTagList.length; i++) {
      let newOption = document.createElement("option")
      newOption.innerHTML = tagForm.totalTagList[i].name
      newOption.value = tagForm.totalTagList[i].name
      newOption.setAttribute("data-id", tagForm.totalTagList[i]._id)
      optionListHolder.append(newOption)

      let newOptionDelete = document.createElement("option")
      newOptionDelete.innerHTML = tagForm.totalTagList[i].name
      newOptionDelete.value = tagForm.totalTagList[i]._id
      newOptionDelete.setAttribute("data-id", tagForm.totalTagList[i]._id)
      optionDeleteHolder.append(newOptionDelete)
    }
  },
  selectTagMethod: () => {
    const selectField = tagForm.select.querySelector("select")
    const selectedTag = selectField.value
    if (selectedTag == "Choose..." || tagForm.selectedTagList.includes(selectedTag)) {
      selectField.value = "Choose..."
      return
    }
    console.log(tagForm.tagDisplayTemplate)
    tagForm.addCurrentTag(selectedTag)
    tagForm.createTagDisplayFromTemplate(selectedTag)
    selectField.value = "Choose..."
  },
  createTagDisplayFromTemplate: selectedTag => {
    // TODO create new tag from tagForm.tagDisplayTemplate
    let newTagDisplay = tagForm.tagDisplayTemplate.content.cloneNode(true)
    let nameDisplay = newTagDisplay.querySelector(".tag-selected--name")
    let closeButton = newTagDisplay.querySelector("button")
    nameDisplay.innerHTML = selectedTag
    // the tag is stored in the data attribute of the close button it can be removed from the list if x is clicked
    closeButton.setAttribute("data-tag", selectedTag)
    console.log(closeButton)
    tagForm.displayHolder.append(newTagDisplay)
  },
  submitTagMethod: () => {
    const submitField = tagForm.submit.querySelector("input")
    const newTagText = submitField.value
    let checkingIfAlreadyUsed = false
    for (let i = 0; i < tagForm.totalTagList.length; i++) {
      if (
        newTagText == tagForm.totalTagList[i].name ||
        newTagText == "That one's already on the list"
      ) {
        submitField.value = "That one's already on the list"
        checkingIfAlreadyUsed = true
      }
    }
    if (checkingIfAlreadyUsed) {
      return
    }
    if (!tagForm.totalTagList.includes(newTagText)) {
      postTag(
        {
          name: newTagText,
        },
        data => {
          console.log(data)
          submitField.value = ""
          tagForm.fetchTotalTags()
        }
      )
    }
  },
  deleteTagMethod: () => {
    const deleteField = tagForm.delete.querySelector("select")
    const selectedTagID = deleteField.value
    if (selectedTagID == "Choose...") {
      return
    }
    deleteTag(selectedTagID, data => {
      console.log(data)
      tagForm.fetchTotalTags()
      deleteField.value = "Choose..."
    })
  },
  xButtonFunction: e => {
    if (e.target.classList.contains("tag-selected--button")) {
      const tagHolder = e.target.parentElement
      const currentTag = tagHolder.querySelector("span").innerHTML
      console.log(currentTag)
      console.log(e.target.dataset.tag)
      tagForm.removeCurrentTag(currentTag)
      tagForm.populateCurrentTags()
    }
  },
  populateCurrentTags: () => {
    tagForm.displayHolder.innerHTML = ""
    for (let i = 0; i < tagForm.selectedTagList.length; i++) {
      tagForm.createTagDisplayFromTemplate(tagForm.selectedTagList[i])
    }
  },
  enableButtonFunctions: () => {
    tagForm.select.querySelector("button").addEventListener("click", tagForm.selectTagMethod)
    tagForm.submit.querySelector("button").addEventListener("click", tagForm.submitTagMethod)
    tagForm.delete.querySelector("button").addEventListener("click", tagForm.deleteTagMethod)
  },
  // data for the currently selected entry
  addCurrentTag: tagToAdd => {
    tagForm.selectedTagList.push(tagToAdd)
  },
  removeCurrentTag: tagToRemove => {
    tagForm.selectedTagList = tagForm.selectedTagList.filter(_remove => {
      return _remove != tagToRemove
    })
  },
  removeAllTags: () => {
    tagForm.selectedTagList = []
    tagForm.displayHolder.innerHTML = ""
  },
}

const imageForm = {
  mainImageUrl: {
    src: "",
    alt: "",
  },
  additionalImageUrlArray: [],
  imageDisplayTemplate: document.querySelector("#template-image-selected"),
  mainImageSubmit: {
    srcInput: document.querySelector("#main-image-submit--link"),
    altInput: document.querySelector("#main-image-submit--alt"),
    button: document.querySelector("#main-image-submit").querySelector("button"),
    close: () => {
      imageForm.mainCardHolder.innerHTML = ""
      imageForm.mainImageUrl.src = ""
      imageForm.mainImageUrl.alt = ""
    },
    method: () => {
      let src = imageForm.mainImageSubmit.srcInput.value
      let alt = imageForm.mainImageSubmit.altInput.value
      if (src != "" && alt != "") {
        imageForm.mainImageSubmit.srcInput.value = ""
        imageForm.mainImageSubmit.altInput.value = ""
        imageForm.mainImageUrl.src = src
        imageForm.mainImageUrl.alt = alt
        imageForm.mainCardHolder.innerHTML = ""
        imageForm.mainCardHolder.append(imageForm.createCardMethod(src, alt, true))
      }
    },
  },
  additionalImageSubmit: {
    srcInput: document.querySelector("#additional-image-submit--link"),
    altInput: document.querySelector("#additional-image-submit--alt"),
    button: document.querySelector("#additional-image-submit").querySelector("button"),
    close: e => {
      let targetHolder = e.target.closest(".image-card-holder")
      let targetSrc = e.target.dataset.src
      let targetAlt = e.target.dataset.alt

      imageForm.additionalImageUrlArray = imageForm.additionalImageUrlArray.filter(object => {
        return object.src != targetSrc && object.alt != targetAlt
      })

      targetHolder.remove()
    },
    method: () => {
      let src = imageForm.additionalImageSubmit.srcInput.value
      let alt = imageForm.additionalImageSubmit.altInput.value
      if (src != "" && alt != "") {
        imageForm.additionalImageSubmit.srcInput.value = ""
        imageForm.additionalImageSubmit.altInput.value = ""

        let newAdditionalEntry = {
          src: src,
          alt: alt,
        }

        imageForm.additionalImageUrlArray.push(newAdditionalEntry)
        imageForm.additionalCardHolder.append(imageForm.createCardMethod(src, alt, false))
      }
    },
  },
  mainCardHolder: document.querySelector("#main-card-holder"),
  additionalCardHolder: document.querySelector("#additional-card-holder"),
  createCardMethod: (_src, _alt, _isMain) => {
    // isMain is a bool, determines what method the x button gets
    let newCard = imageForm.imageDisplayTemplate.content.cloneNode(true)
    let closeButton = newCard.querySelector("button")
    let cardImage = newCard.querySelector("img")
    let cardText = newCard.querySelector("p")

    if (_isMain) {
      closeButton.addEventListener("click", imageForm.mainImageSubmit.close)
    } else {
      closeButton.addEventListener("click", imageForm.additionalImageSubmit.close)
      closeButton.dataset.src = _src
      closeButton.dataset.alt = _alt
    }

    cardImage.src = _src
    cardImage.alt = _alt
    cardText.innerHTML = _alt

    return newCard
  },
  resetInputFields: () => {
    imageForm.mainCardHolder.innerHTML = ""
    imageForm.additionalCardHolder.innerHTML = ""
    imageForm.mainImageUrl = { src: "", alt: "" }
    imageForm.additionalImageUrlArray = []
    imageForm.mainImageSubmit.srcInput.value = ""
    imageForm.mainImageSubmit.altInput.value = ""
    imageForm.additionalImageSubmit.srcInput.value = ""
    imageForm.additionalImageSubmit.altInput.value = ""
  },
  enableButtonFunctions: () => {
    imageForm.mainImageSubmit.button.addEventListener("click", imageForm.mainImageSubmit.method)
    imageForm.additionalImageSubmit.button.addEventListener(
      "click",
      imageForm.additionalImageSubmit.method
    )
  },
}

console.log(imageForm)

let classForm = {
  // show or hide based on check boxes
  toggle: {
    virtualPrice: document.querySelector("#price-display--virtual-kit"),
    virtualNoKitPrice: document.querySelector("#price-display--virtual-no-kit"),
    inPersonPrice: document.querySelector("#price-display--in-person"),
  },
  classNameInput: document.querySelector("#class-name").querySelector("input"),
  description: document.querySelector("#description").querySelector(".ql-editor"),
  disclaimer: document.querySelector("#disclaimer").querySelector("input"),
  durationFields: {
    string: document.querySelector("#class-duration--text"),
    num: document.querySelector("#class-duration--number"),
  },
  availableCheckboxes: {
    virtual: document.querySelector("#available-virtual"),
    virtualNoKit: document.querySelector("#available-virtual-no-kit"),
    inPerson: document.querySelector("#available-in-person"),
  },
  ageCheckboxes: {
    adult: document.querySelector("#age-adult"),
    child: document.querySelector("#age-child"),
    mixed: document.querySelector("#age-mixed"),
  },
  locationCheckboxes: {
    boutique: document.querySelector("#location-boutique"),
    montclairWomanClub: document.querySelector("#location-club"),
    customVenue: document.querySelector("#location-custom"),
  },
  priceFields: {
    priceForSearchFunction: {
      lowRange: document.querySelector("#price-sorting--low"),
      highRange: document.querySelector("#price-sorting--high"),
    },
    multiplePrices: {
      virtual: document.querySelector("#price-display--virtual-kit").querySelector("input"),
      virtualNoKit: document.querySelector("#price-display--virtual-no-kit").querySelector("input"),
      inPerson: document.querySelector("#price-display--in-person").querySelector("input"),
      addOn: document.querySelector("#price-display--add-on").querySelector("input"),
    },
  },
  minimumParticipantsField: document
    .querySelector("#minimum-paticipants--text")
    .querySelector("input"),
  videoField: document.querySelector("#video--text").querySelector("input"),
  videoPreviewHolder: document.querySelector("#preview-video-holder"),
  videoPreviewButton: document.querySelector("#video--text").querySelector("button"),
  videoPreviewDisplayTemplate: document.querySelector("#template-video-preview-iframe"),
  submitButton: document.querySelector("#class-submit-button"),
  updateButton: document.querySelector("#class-update-button"),
  deleteButton: document.querySelector("#class-delete-button"),
  formatDataFromClassInputForm: () => {
    // remember that empty values == false
    let newClass = {}
    newClass.name = classForm.classNameInput.value
    // check against '<p><br></p>' to see if empty
    newClass.description = classForm.description.innerHTML
    newClass.duration = {
      string: classForm.durationFields.string.value,
      num: classForm.durationFields.num.value,
    }
    newClass.disclaimer = classForm.disclaimer.value
    newClass.availability = {
      virtual: classForm.availableCheckboxes.virtual.checked,
      virtualNoKit: classForm.availableCheckboxes.virtualNoKit.checked,
      inPerson: classForm.availableCheckboxes.inPerson.checked,
    }
    newClass.allowedLocations = {
      boutique: classForm.locationCheckboxes.boutique.checked,
      montclairWomanClub: classForm.locationCheckboxes.montclairWomanClub.checked,
      customVenue: classForm.locationCheckboxes.customVenue.checked,
      virtualOnly:
        classForm.locationCheckboxes.boutique.checked ||
        classForm.locationCheckboxes.montclairWomanClub.checked ||
        classForm.locationCheckboxes.customVenue.checked
          ? false
          : true,
    }
    newClass.price = {
      priceForSearchFunction: {
        lowRange: classForm.priceFields.priceForSearchFunction.lowRange.value,
        highRange: classForm.priceFields.priceForSearchFunction.highRange.value,
      },
      multiplePrices: {
        virtual: {
          available: classForm.priceFields.multiplePrices.virtual.value != "",
          price: classForm.priceFields.multiplePrices.virtual.value,
        },
        virtualNoKit: {
          available: classForm.priceFields.multiplePrices.virtualNoKit.value != "",
          price: classForm.priceFields.multiplePrices.virtualNoKit.value,
        },
        inPerson: {
          available: classForm.priceFields.multiplePrices.inPerson.value != "",
          price: classForm.priceFields.multiplePrices.inPerson.value,
        },
        addOn: {
          available: classForm.priceFields.multiplePrices.addOn.value != "",
          price: classForm.priceFields.multiplePrices.addOn.value,
        },
      },
    }
    newClass.minimumParticipants = {
      hasMinimum: classForm.minimumParticipantsField.value != "",
      minimum: classForm.minimumParticipantsField.value,
    }
    newClass.ageGroup = {
      adult: classForm.ageCheckboxes.adult.checked,
      child: classForm.ageCheckboxes.child.checked,
      mixed: classForm.ageCheckboxes.mixed.checked,
    }
    newClass.video = {
      hasVideo: classForm.videoField.value != "",
      link: classForm.videoField.value,
    }
    newClass.tags = tagForm.selectedTagList
    newClass.photos = [imageForm.mainImageUrl]
    if (imageForm.additionalImageUrlArray.length > 0) {
      imageForm.additionalImageUrlArray.forEach(item => {
        newClass.photos.push(item)
      })
    }
    console.log(newClass)
    warning.checkFormDataIsFormatted(newClass)
  },
  rejectClassUpload: problem => {
    alert(problem)
  },
  previewVideoButtonFunction: () => {
    classForm.videoPreviewHolder.innerHTML = ""
    let checkingString = "https://www.youtube.com/embed/"

    if (!classForm.videoField.value.includes(checkingString)) {
      return
    }

    let newVideoPlayer = classForm.videoPreviewDisplayTemplate.content.cloneNode(true)
    let newVideoPlayerIFrame = newVideoPlayer.querySelector("iframe")
    newVideoPlayerIFrame.src = classForm.videoField.value

    classForm.videoPreviewHolder.append(newVideoPlayer)
  },
  submitButtonFunction: () => {
    classForm.formatDataFromClassInputForm()
  },
  submitClassCallbackMethod: response => {
    console.log(response)
  },
  resetInputFields: () => {
    classForm.toggle.virtualPrice.classList.add("d-none")
    classForm.toggle.virtualNoKitPrice.classList.add("d-none")
    classForm.toggle.inPersonPrice.classList.add("d-none")
    classForm.classNameInput.value = ""
    classForm.description.innerHTML = "<p><br></p>"
    classForm.disclaimer.value = ""
    classForm.durationFields.string.value = ""
    classForm.durationFields.num.value = ""
    classForm.availableCheckboxes.virtual.checked = false
    classForm.availableCheckboxes.virtualNoKit.checked = false
    classForm.availableCheckboxes.inPerson.checked = false
    classForm.ageCheckboxes.adult.checked = false
    classForm.ageCheckboxes.child.checked = false
    classForm.ageCheckboxes.mixed.checked = false
    classForm.locationCheckboxes.boutique.checked = false
    classForm.locationCheckboxes.montclairWomanClub.checked = false
    classForm.locationCheckboxes.customVenue.checked = false
    classForm.priceFields.priceForSearchFunction.lowRange.value = ""
    classForm.priceFields.priceForSearchFunction.highRange.value = ""
    classForm.priceFields.multiplePrices.virtual.value = ""
    classForm.priceFields.multiplePrices.virtualNoKit.value = ""
    classForm.priceFields.multiplePrices.inPerson.value = ""
    classForm.priceFields.multiplePrices.addOn.value = ""
    classForm.minimumParticipantsField.value = ""
    classForm.videoField.value = ""
    classForm.videoPreviewHolder.innerHTML = ""
  },
}

const warning = {
  mandatoryColor: "text-danger",
  atLeastOneColor: "text-warning",
  incorrectlyFormattedColor: "text-info",
  hidingClass: "d-none",
  explanation: document.querySelector("#error-explanation"),
  tag: document.querySelector("#tag-select").querySelector("span"),
  name: document.querySelector("#class-name").querySelector("span"),
  duration: document.querySelector("#class-duration").querySelector("span"),
  availableArray: document.querySelector("#available-holder").querySelectorAll(".form-check-label"),
  ageGroupArray: document.querySelector("#age-holder").querySelectorAll(".form-check-label"),
  locationArray: document.querySelector("#location-holder").querySelectorAll(".form-check-label"),
  priceInternal: document.querySelector("#price-sorting").querySelector("span"),
  priceVirtual: document.querySelector("#price-display--virtual-kit").querySelector("span"),
  priceVirtualNoKit: document.querySelector("#price-display--virtual-no-kit").querySelector("span"),
  priceInPerson: document.querySelector("#price-display--in-person").querySelector("span"),
  minimumParticipants: document.querySelector("#minimum-paticipants--text").querySelector("span"),
  video: document.querySelector("#video--text").querySelector("span"),
  mainImage: document.querySelector("#main-image-submit").querySelector("span"),
  description: document.querySelector("#description-label"),
  resetWarnings: () => {
    warning.explanation.classList.add(warning.hidingClass)
    warning.tag.classList.remove(warning.mandatoryColor)
    warning.name.classList.remove(warning.mandatoryColor)
    warning.duration.classList.remove(warning.mandatoryColor)
    warning.availableArray.forEach(item => {
      item.classList.remove(warning.atLeastOneColor)
    })
    warning.ageGroupArray.forEach(item => {
      item.classList.remove(warning.atLeastOneColor)
    })
    warning.locationArray.forEach(item => {
      item.classList.remove(warning.atLeastOneColor)
    })
    warning.priceInternal.classList.remove(warning.mandatoryColor)
    warning.priceVirtual.classList.remove(warning.mandatoryColor)
    warning.priceVirtualNoKit.classList.remove(warning.mandatoryColor)
    warning.priceInPerson.classList.remove(warning.mandatoryColor)
    warning.minimumParticipants.classList.remove(warning.incorrectlyFormattedColor)
    warning.video.classList.remove(warning.incorrectlyFormattedColor)
    warning.description.classList.remove(warning.mandatoryColor)
    warning.mainImage.classList.remove(warning.mandatoryColor)
  },
  checkFormDataIsFormatted: formData => {
    warning.resetWarnings()
    let noErrors = true
    // has at least 1 tag
    if (formData.tags.length < 1) {
      noErrors = false
      warning.tag.classList.add(warning.mandatoryColor)
    }
    // has name
    if (formData.name.length < 1) {
      noErrors = false
      warning.name.classList.add(warning.mandatoryColor)
    }
    // has duration, both fields, num greater than 0
    if (formData.duration.string == "" || formData.duration.num < 1) {
      noErrors = false
      warning.duration.classList.add(warning.mandatoryColor)
    }
    // at least 1 available checked
    if (
      !formData.availability.virtual &&
      !formData.availability.virtualNoKit &&
      !formData.availability.inPerson
    ) {
      noErrors = false
      warning.availableArray.forEach(item => {
        item.classList.add(warning.atLeastOneColor)
      })
    }
    // at least 1 age group checked
    if (!formData.ageGroup.adult && !formData.ageGroup.child && !formData.ageGroup.mixed) {
      noErrors = false
      warning.ageGroupArray.forEach(item => {
        item.classList.add(warning.atLeastOneColor)
      })
    }
    // at least 1 location IF "in person" is an option
    if (formData.availability.inPerson && formData.allowedLocations.virtualOnly) {
      noErrors = false
      warning.locationArray.forEach(item => {
        item.classList.add(warning.atLeastOneColor)
      })
    }
    // has price interval, low range <= high range
    if (
      !formData.price.priceForSearchFunction.lowRange ||
      !formData.price.priceForSearchFunction.highRange ||
      formData.price.priceForSearchFunction.lowRange >
        formData.price.priceForSearchFunction.highRange
    ) {
      noErrors = false
      warning.priceInternal.classList.add(warning.mandatoryColor)
    }
    // all appropriate price options filled
    if (formData.availability.virtual && !formData.price.multiplePrices.virtual.price) {
      noErrors = false
      warning.priceVirtual.classList.add(warning.mandatoryColor)
    }
    if (formData.availability.virtualNoKit && !formData.price.multiplePrices.virtualNoKit.price) {
      noErrors = false
      warning.priceVirtualNoKit.classList.add(warning.mandatoryColor)
    }
    if (formData.availability.inPerson && !formData.price.multiplePrices.inPerson.price) {
      noErrors = false
      warning.priceInPerson.classList.add(warning.mandatoryColor)
    }
    // minimum participants ignored if blank or 0, reject if negative or fraction
    if (
      formData.minimumParticipants.minimum < 0 ||
      (formData.minimumParticipants.hasMinimum &&
        !Number.isInteger(parseFloat(formData.minimumParticipants.minimum)))
    ) {
      noErrors = false
      warning.minimumParticipants.classList.add(warning.incorrectlyFormattedColor)
    }
    // video absent or formatted correctly
    if (formData.video.hasVideo && !formData.video.link.includes("embed")) {
      noErrors = false
      warning.video.classList.add(warning.incorrectlyFormattedColor)
    }

    // TODO at least one image
    if (formData.photos[0].src == "") {
      noErrors = false
      warning.mainImage.classList.add(warning.mandatoryColor)
    }

    // has description
    if (formData.description == "<p><br></p>") {
      noErrors = false
      warning.description.classList.add(warning.mandatoryColor)
    }

    // What to do if there's an error
    if (!noErrors) {
      warning.explanation.classList.remove(warning.hidingClass)
      return
    }

    postClass(formData, classForm.submitClassCallbackMethod)
  },
}

tagForm.enableButtonFunctions()
tagForm.fetchTotalTags()
console.log(classForm)
classForm.submitButton.addEventListener("click", classForm.submitButtonFunction)
classForm.videoPreviewButton.addEventListener("click", classForm.previewVideoButtonFunction)

imageForm.enableButtonFunctions()
classLoaderForm.enableButtonFunctions()

// toggle price inputs
classForm.availableCheckboxes.virtual.addEventListener("change", e => {
  classForm.availableCheckboxes.virtual.checked
    ? classForm.toggle.virtualPrice.classList.remove(warning.hidingClass)
    : classForm.toggle.virtualPrice.classList.add(warning.hidingClass)
})
classForm.availableCheckboxes.virtualNoKit.addEventListener("change", e => {
  classForm.availableCheckboxes.virtualNoKit.checked
    ? classForm.toggle.virtualNoKitPrice.classList.remove(warning.hidingClass)
    : classForm.toggle.virtualNoKitPrice.classList.add(warning.hidingClass)
})
classForm.availableCheckboxes.inPerson.addEventListener("change", e => {
  classForm.availableCheckboxes.inPerson.checked
    ? classForm.toggle.inPersonPrice.classList.remove(warning.hidingClass)
    : classForm.toggle.inPersonPrice.classList.add(warning.hidingClass)
})

console.log(warning)
getAllClasses(data => {
  console.log(data)
})

document.querySelector("body").addEventListener("click", e => {
  tagForm.xButtonFunction(e)
})
