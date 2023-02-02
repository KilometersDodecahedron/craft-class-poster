const changeChecker = {
  storedLeaveFunction: "",
  changeHasOccured: false,
  warningOverlay: document.querySelector("#overlay-unsaved-data-warning"),
  cancelButton: document.querySelector("#overlay-unsaved-data-warning--cancel"),
  leaveButton: document.querySelector("#overlay-unsaved-data-warning--leave"),
  textComponentArray: [
    document.querySelector("#class-name").querySelector("input"),
    document.querySelector("#class-duration--text"),
    document.querySelector("#class-duration--number"),
    document.querySelector("#price-sorting--low"),
    document.querySelector("#price-sorting--high"),
    document.querySelector("#price-display--virtual-kit").querySelector("input"),
    document.querySelector("#price-display--virtual-no-kit").querySelector("input"),
    document.querySelector("#price-display--in-person").querySelector("input"),
    document.querySelector("#price-display--add-on").querySelector("input"),
    document.querySelector("#minimum-paticipants--text").querySelector("input"),
    document.querySelector("#video--text").querySelector("input"),
    document.querySelector("#disclaimer").querySelector("input"),
  ],
  toggleComponentArray: [
    document.querySelector("#available-virtual"),
    document.querySelector("#available-virtual-no-kit"),
    document.querySelector("#available-in-person"),
    document.querySelector("#age-adult"),
    document.querySelector("#age-child"),
    document.querySelector("#age-mixed"),
    document.querySelector("#location-boutique"),
    document.querySelector("#location-club"),
    document.querySelector("#location-custom"),
    ...document.querySelectorAll("input[name='difficulty']"),
    document.querySelector("#featured-checkbox"),
  ],
  quillEditorArray: [quillDescription, quillWhatsIncluded, quillNeedToBring],
  // called by imageFileFunctions.mainImage.selectButtonFunction in image-file-functions.js
  // called by imageFileFunctions.mainImage.xButtonFunction in image-file-functions.js
  // called by imageFileFunctions.additionalImages.preview in image-file-functions.js
  // called by categoryForm.selectCategoryMethod in category-form-functions.js
  // called by categoryForm.xButtonFunction in category-form-functions.js
  // called by tagFor.populateCurrentTags in tag-form-functions.js
  changeFunction: e => {
    changeChecker.changeHasOccured = true
    // console.log("change")
    // console.log(e)
  },
  // called by classForm.populateExistingClass in form-functions.js
  // called by classForm.resetInputFields in form-functions.js
  resetCheckerFunction: () => {
    // the quill editor's text-change event happens after everything else, so the slight delay fixes the timing issue
    setTimeout(() => {
      changeChecker.changeHasOccured = false
      //   console.log("reset")
      //   console.log(changeChecker.changeHasOccured)
    }, 1)
  },
  showOverlayFunction: () => {
    changeChecker.warningOverlay.classList.remove("d-none")
  },
  hideOverlayFunction: () => {
    changeChecker.warningOverlay.classList.add("d-none")
  },
  cancelButtonFunction: () => {
    changeChecker.hideOverlayFunction()
    changeChecker.storedLeaveFunction = ""
  },
  leaveButtonFunction: () => {
    changeChecker.storedLeaveFunction()
    changeChecker.hideOverlayFunction()
    changeChecker.storedLeaveFunction = ""
  },
  // called by classLoaderForm.newClassButtonFunction in class-loader-functions.js
  // called by classLoaderForm.classSelectButtonFunction in class-loader-functions.js
  checkForUnsavedChanges: _callback => {
    if (changeChecker.changeHasOccured) {
      changeChecker.storedLeaveFunction = _callback
      changeChecker.showOverlayFunction()
    } else {
      _callback()
    }
  },
  startFunctions: () => {
    console.log(changeChecker)
    changeChecker.cancelButton.addEventListener("click", changeChecker.cancelButtonFunction)
    changeChecker.leaveButton.addEventListener("click", changeChecker.leaveButtonFunction)
    changeChecker.quillEditorArray.forEach(field => {
      field.on("text-change", changeChecker.changeFunction)
    })
    changeChecker.textComponentArray.forEach(field => {
      field.addEventListener("change", changeChecker.changeFunction)
    })
    changeChecker.toggleComponentArray.forEach(field => {
      field.addEventListener("change", changeChecker.changeFunction)
    })
  },
}
