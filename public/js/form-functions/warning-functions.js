const warning = {
  mandatoryColor: "text-danger",
  atLeastOneColor: "text-warning",
  incorrectlyFormattedColor: "text-info",
  hidingClass: "d-none",
  explanation: document.querySelector("#error-explanation"),
  tag: document.querySelector("#tag-select").querySelector("span"),
  category: document.querySelector("#category-select").querySelector("span"),
  name: document.querySelector("#class-name").querySelector("span"),
  duration: document.querySelector("#class-duration").querySelector("span"),
  availableArray: document.querySelector("#available-holder").querySelectorAll(".form-check-label"),
  ageGroupArray: document.querySelector("#age-holder").querySelectorAll(".form-check-label"),
  locationArray: document.querySelector("#location-holder").querySelectorAll(".form-check-label"),
  difficultyArray: document.querySelectorAll(".difficulty-label"),
  priceInternal: document.querySelector("#price-sorting").querySelector("span"),
  priceVirtual: document.querySelector("#price-display--virtual-kit").querySelector("span"),
  priceVirtualNoKit: document.querySelector("#price-display--virtual-no-kit").querySelector("span"),
  priceInPerson: document.querySelector("#price-display--in-person").querySelector("span"),
  minimumParticipants: document.querySelector("#minimum-paticipants--text").querySelector("span"),
  video: document.querySelector("#video--text").querySelector("span"),
  mainImage: document.querySelector("#main-image-submit").querySelector("span"),
  description: document.querySelector("#description-label"),
  whatsIncluded: document.querySelector("#description-whats-included-label"),
  whatDoParticipantsNeedToBring: document.querySelector("#description-need-to-bring-label"),
  resetWarnings: () => {
    warning.explanation.classList.add(warning.hidingClass)
    warning.tag.classList.remove(warning.mandatoryColor)
    warning.category.classList.remove(warning.mandatoryColor)
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
    warning.difficultyArray.forEach(item => {
      item.classList.remove(warning.atLeastOneColor)
    })
    warning.priceInternal.classList.remove(warning.mandatoryColor)
    warning.priceVirtual.classList.remove(warning.mandatoryColor)
    warning.priceVirtualNoKit.classList.remove(warning.mandatoryColor)
    warning.priceInPerson.classList.remove(warning.mandatoryColor)
    warning.minimumParticipants.classList.remove(warning.incorrectlyFormattedColor)
    warning.video.classList.remove(warning.incorrectlyFormattedColor)
    warning.description.classList.remove(warning.mandatoryColor)
    warning.whatsIncluded.classList.remove(warning.mandatoryColor)
    warning.whatDoParticipantsNeedToBring.classList.remove(warning.mandatoryColor)
    warning.mainImage.classList.remove(warning.mandatoryColor)
  },
  checkFormDataIsFormatted: (formData, isUpdate) => {
    warning.resetWarnings()
    let noErrors = true
    // has a category defined
    if (formData.category == "" || formData.category == undefined) {
      noErrors = false
      warning.category.classList.add(warning.mandatoryColor)
      console.log("no category")
    }

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
    // difficulty selected
    if (!classForm.difficultyOptionsSet.has(formData.difficulty)) {
      noErrors = false
      warning.difficultyArray.forEach(item => {
        item.classList.add(warning.atLeastOneColor)
      })
    }
    if (
      !formData.price.priceForSearchFunction.lowRange ||
      !formData.price.priceForSearchFunction.highRange ||
      parseInt(formData.price.priceForSearchFunction.lowRange) >
        parseInt(formData.price.priceForSearchFunction.highRange)
    ) {
      // has price interval, low range <= high range
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

    // has main image
    if (imageFileFunctions.mainImage.src == "" || imageFileFunctions.mainImage.alt == "") {
      noErrors = false
      warning.mainImage.classList.add(warning.mandatoryColor)
    }
    if (formData.description == "<p><br></p>" || formData.description == null) {
      // has description
      noErrors = false
      warning.description.classList.add(warning.mandatoryColor)
    }

    // has "what's included"
    if (formData.whatsIncluded == "<p><br></p>" || formData.whatsIncluded == null) {
      noErrors = false
      warning.whatsIncluded.classList.add(warning.mandatoryColor)
    }

    // has "what do participants need to bring"
    if (
      formData.whatDoParticipantsNeedToBring == "<p><br></p>" ||
      formData.whatDoParticipantsNeedToBring == null
    ) {
      noErrors = false
      warning.whatDoParticipantsNeedToBring.classList.add(warning.mandatoryColor)
    }

    // What to do if there's an error
    if (!noErrors) {
      warning.explanation.classList.remove(warning.hidingClass)
      warning.category.scrollIntoView()
      return
    }

    if (isUpdate) {
      classForm.showOverlay()
      // updateClass(formData, classLoaderForm.currentClassID, classForm.submitClassCallbackMethod)
      imageFileFunctions.manageImageFilesBeforeClassData(
        "update",
        formData,
        classForm.submitClassCallbackMethod,
        classLoaderForm.currentClassID
      )
    } else {
      classForm.showOverlay()
      // postClass(formData, classForm.submitClassCallbackMethod)
      imageFileFunctions.manageImageFilesBeforeClassData(
        "create",
        formData,
        classForm.submitClassCallbackMethod
      )
    }
  },
}
