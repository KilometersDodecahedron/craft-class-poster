const classForm = {
  processingMessageOverlay: document.querySelector("#overlay-processing-request"),
  difficultyOptionsSet: new Set(["Beginner", "Intermediate", "Advanced"]),
  // show or hide based on check boxes
  toggle: {
    virtualPrice: document.querySelector("#price-display--virtual-kit"),
    virtualNoKitPrice: document.querySelector("#price-display--virtual-no-kit"),
    inPersonPrice: document.querySelector("#price-display--in-person"),
  },
  classNameInput: document.querySelector("#class-name").querySelector("input"),
  description: document.querySelector("#description").querySelector(".ql-editor"),
  whatsIncluded: document.querySelector("#description-whats-included").querySelector(".ql-editor"),
  whatDoParticipantsNeedToBring: document
    .querySelector("#description-need-to-bring")
    .querySelector(".ql-editor"),
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
    teen: document.querySelector("#age-teen"),
    child: document.querySelector("#age-child"),
    mixed: document.querySelector("#age-mixed"),
  },
  locationCheckboxes: {
    boutique: document.querySelector("#location-boutique"),
    montclairWomanClub: document.querySelector("#location-club"),
    customVenue: document.querySelector("#location-custom"),
  },
  difficultyRadioButtons: document.querySelectorAll("input[name='difficulty']"),
  priceFields: {
    priceForSearchFunction: {
      lowRange: document.querySelector("#price-sorting--low"),
      highRange: document.querySelector("#price-sorting--high"),
    },
    multiplePrices: {
      virtual: document.querySelector("#price-display--virtual-kit").querySelector("input"),
      virtualNoKit: document.querySelector("#price-display--virtual-no-kit").querySelector("input"),
      inPerson: document.querySelector("#price-display--in-person").querySelector("input"),
      addOn: document
        .querySelector("#description-addons-and-modifiers")
        .querySelector(".ql-editor"),
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
  deleteDoublecheckButton: document.querySelector("#class-delete-doublecheck-button"),
  featuredToggle: document.querySelector("#featured-checkbox"),
  toggleDisplaysMethod: () => {
    classForm.availableCheckboxes.virtual.checked
      ? classForm.toggle.virtualPrice.classList.remove(warning.hidingClass)
      : classForm.toggle.virtualPrice.classList.add(warning.hidingClass)
    classForm.availableCheckboxes.virtualNoKit.checked
      ? classForm.toggle.virtualNoKitPrice.classList.remove(warning.hidingClass)
      : classForm.toggle.virtualNoKitPrice.classList.add(warning.hidingClass)
    classForm.availableCheckboxes.inPerson.checked
      ? classForm.toggle.inPersonPrice.classList.remove(warning.hidingClass)
      : classForm.toggle.inPersonPrice.classList.add(warning.hidingClass)
  },
  formatDataFromClassInputForm: isUpdate => {
    // remember that empty values == false
    let newClass = {}
    newClass.name = classForm.classNameInput.value
    // check against '<p><br></p>' to see if empty
    newClass.description = HELPER_removeExtraLineBreaks(classForm.description.innerHTML)
    newClass.whatsIncluded = HELPER_removeExtraLineBreaks(classForm.whatsIncluded.innerHTML)
    newClass.whatDoParticipantsNeedToBring = HELPER_removeExtraLineBreaks(
      classForm.whatDoParticipantsNeedToBring.innerHTML
    )
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
    classForm.difficultyRadioButtons.forEach(item => {
      if (item.checked == true) {
        newClass.difficulty = item.value
      }
    })
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
          available:
            classForm.priceFields.multiplePrices.addOn.value != "" &&
            classForm.priceFields.multiplePrices.addOn.value != "<p><br></p>",
          price: HELPER_removeExtraLineBreaks(classForm.priceFields.multiplePrices.addOn.innerHTML),
        },
      },
    }
    newClass.minimumParticipants = {
      hasMinimum: classForm.minimumParticipantsField.value != "",
      minimum: classForm.minimumParticipantsField.value,
    }
    newClass.ageGroup = {
      adult: classForm.ageCheckboxes.adult.checked,
      teen: classForm.ageCheckboxes.teen.checked,
      child: classForm.ageCheckboxes.child.checked,
      mixed: classForm.ageCheckboxes.mixed.checked,
    }
    newClass.video = {
      hasVideo: classForm.videoField.value != "",
      link: classForm.videoField.value,
    }
    newClass.tags = tagForm.selectedTagList
    newClass.category = categoryForm.currentCategory
    // TODO redo photos
    // newClass.photos = [imageForm.mainImageUrl]
    // if (imageForm.additionalImageUrlArray.length > 0) {
    //   imageForm.additionalImageUrlArray.forEach(item => {
    //     newClass.photos.push(item)
    //   })
    // }
    newClass.featured = classForm.featuredToggle.checked
    warning.checkFormDataIsFormatted(newClass, isUpdate)
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
    classForm.formatDataFromClassInputForm(false)
  },
  updateButtonFunction: () => {
    classForm.formatDataFromClassInputForm(true)
  },
  deleteButtonFunction: () => {
    classForm.deleteDoublecheckButton.classList.remove("d-none")
  },
  deleteDoublecheckButtonFunction: () => {
    // TODO add imageFileFunctions.manageImageFilesBeforeClassData
    let targetClass = classLoaderForm.loadedClasses.find(
      target => target._id === classLoaderForm.currentClassID
    )
    imageFileFunctions.manageImageFilesBeforeClassData(
      "delete",
      targetClass,
      classForm.submitClassCallbackMethod,
      classLoaderForm.currentClassID
    )
    // deleteClass(classLoaderForm.currentClassID, classForm.submitClassCallbackMethod)
  },
  showOverlay: () => {
    classForm.processingMessageOverlay.classList.remove("d-none")
  },
  hideOverlay: () => {
    classForm.processingMessageOverlay.classList.add("d-none")
  },
  submitClassCallbackMethod: response => {
    window.scrollTo(0, 0)
    classLoaderForm.resetAllClassProperties()
    classLoaderForm.fetchData()
    classForm.hideOverlay()
  },
  resetInputFields: () => {
    classForm.toggle.virtualPrice.classList.add("d-none")
    classForm.toggle.virtualNoKitPrice.classList.add("d-none")
    classForm.toggle.inPersonPrice.classList.add("d-none")
    classForm.classNameInput.value = ""
    classForm.description.innerHTML = "<p><br></p>"
    classForm.whatsIncluded.innerHTML = "<p><br></p>"
    classForm.whatDoParticipantsNeedToBring.innerHTML = "<p><br></p>"
    classForm.disclaimer.value = ""
    classForm.durationFields.string.value = ""
    classForm.durationFields.num.value = ""
    classForm.availableCheckboxes.virtual.checked = false
    classForm.availableCheckboxes.virtualNoKit.checked = false
    classForm.availableCheckboxes.inPerson.checked = false
    classForm.ageCheckboxes.adult.checked = false
    classForm.ageCheckboxes.teen.checked = false
    classForm.ageCheckboxes.child.checked = false
    classForm.ageCheckboxes.mixed.checked = false
    classForm.locationCheckboxes.boutique.checked = false
    classForm.locationCheckboxes.montclairWomanClub.checked = false
    classForm.locationCheckboxes.customVenue.checked = false
    classForm.featuredToggle.checked = false

    // difficulty
    classForm.difficultyRadioButtons.forEach(_input => {
      _input.checked = false
    })

    classForm.priceFields.priceForSearchFunction.lowRange.value = ""
    classForm.priceFields.priceForSearchFunction.highRange.value = ""
    classForm.priceFields.multiplePrices.virtual.value = ""
    classForm.priceFields.multiplePrices.virtualNoKit.value = ""
    classForm.priceFields.multiplePrices.inPerson.value = ""
    classForm.priceFields.multiplePrices.addOn.innerHTML = ""
    classForm.minimumParticipantsField.value = ""
    classForm.videoField.value = ""
    classForm.videoPreviewHolder.innerHTML = ""
    classForm.populateDefaultDisclaimer()
    // reset changeChecker
    changeChecker.resetCheckerFunction()
  },
  populateExistingClass: _classEntry => {
    classLoaderForm.currentClassDisplayName.innerHTML = _classEntry.name
    categoryForm.resetCategory()
    tagForm.removeAllTags()
    // imageForm.resetInputFields()
    imageFileFunctions.resetEverything()
    classForm.resetInputFields()
    warning.resetWarnings()
    classForm.classNameInput.value = _classEntry.name
    classForm.description.innerHTML = _classEntry.description
    classForm.whatsIncluded.innerHTML = _classEntry.whatsIncluded
    classForm.whatDoParticipantsNeedToBring.innerHTML = _classEntry.whatDoParticipantsNeedToBring
    classForm.disclaimer.value = _classEntry.disclaimer
    classForm.durationFields.string.value = _classEntry.duration.string
    classForm.durationFields.num.value = _classEntry.duration.num
    classForm.availableCheckboxes.virtual.checked = _classEntry.availability.virtual
    classForm.availableCheckboxes.virtualNoKit.checked = _classEntry.availability.virtualNoKit
    classForm.availableCheckboxes.inPerson.checked = _classEntry.availability.inPerson
    classForm.toggleDisplaysMethod()
    classForm.ageCheckboxes.adult.checked = _classEntry.ageGroup.adult
    classForm.ageCheckboxes.teen.checked = _classEntry.ageGroup?.teen
    classForm.ageCheckboxes.child.checked = _classEntry.ageGroup.child
    classForm.ageCheckboxes.mixed.checked = _classEntry.ageGroup.mixed
    classForm.locationCheckboxes.boutique.checked = _classEntry.allowedLocations.boutique
    classForm.locationCheckboxes.montclairWomanClub.checked =
      _classEntry.allowedLocations.montclairWomanClub
    classForm.locationCheckboxes.customVenue.checked = _classEntry.allowedLocations.customVenue
    classForm.difficultyRadioButtons.forEach(item => {
      if (_classEntry.difficulty == item.value) {
        item.checked = true
      }
    })
    classForm.priceFields.priceForSearchFunction.lowRange.value =
      _classEntry?.price?.priceForSearchFunction?.lowRange
    classForm.priceFields.priceForSearchFunction.highRange.value =
      _classEntry?.price?.priceForSearchFunction?.highRange
    classForm.priceFields.multiplePrices.virtual.value =
      _classEntry.price.multiplePrices.virtual.price
    classForm.priceFields.multiplePrices.virtualNoKit.value =
      _classEntry.price.multiplePrices.virtualNoKit.price
    classForm.priceFields.multiplePrices.inPerson.value =
      _classEntry.price.multiplePrices.inPerson.price
    if (_classEntry?.price?.multiplePrices?.addOn?.price) {
      classForm.priceFields.multiplePrices.addOn.innerHTML =
        _classEntry?.price?.multiplePrices?.addOn?.price
    }
    if (_classEntry.minimumParticipants.hasMinimum) {
      classForm.minimumParticipantsField.value = _classEntry.minimumParticipants.minimum
    }
    if (_classEntry.video.hasVideo) {
      classForm.videoField.value = _classEntry.video.link
      classForm.previewVideoButtonFunction()
    }

    classForm.featuredToggle.checked = _classEntry.featured

    // difficulty
    classForm.difficultyRadioButtons.forEach(_input => {
      if (_input.value == _classEntry.difficulty) {
        _input.checked = true
      }
    })

    // UPDATED add images
    imageFileFunctions.mainImage.populateFromExistingClassData(_classEntry)
    imageFileFunctions.additionalImages.populateFromExistingClassData(_classEntry)

    // add tags
    if (_classEntry.tags.length > 0) {
      let tagList = [..._classEntry.tags]
      tagForm.determineWhichTagsHaveBeenDeleted(tagList)
      // tagForm.selectedTagList = [..._classEntry.tags]
      // tagForm.populateCurrentTags()
    }

    // add class
    if (_classEntry.category) {
      categoryForm.determineIfCategoryHasBeenDeletedWhenLoadingClass(_classEntry.category)
      // categoryForm.createCategoryDisplayFromTemplate(_classEntry.category)
    }

    // reset changeChecker
    changeChecker.resetCheckerFunction()
  },
  enableButtonFunctions: () => {
    classForm.submitButton.addEventListener("click", classForm.submitButtonFunction)
    classForm.updateButton.addEventListener("click", classForm.updateButtonFunction)
    classForm.deleteButton.addEventListener("click", classForm.deleteButtonFunction)
    classForm.deleteDoublecheckButton.addEventListener(
      "click",
      classForm.deleteDoublecheckButtonFunction
    )
    classForm.videoPreviewButton.addEventListener("click", classForm.previewVideoButtonFunction)
  },
  populateDefaultDisclaimer: () => {
    classForm.disclaimer.value = staticData.defaultDisclaimer
  },
  startFunctions: () => {
    classForm.enableButtonFunctions()
    classForm.populateDefaultDisclaimer()
  },
}
