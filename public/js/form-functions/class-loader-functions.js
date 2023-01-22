const classLoaderForm = {
  currentClassID: "",
  loadedClasses: [],
  classLoaderDropdownHolder: document.querySelector("#class-loader-dropdown-holder"),
  newClassButton: document.querySelector("#new-class-button"),
  currentClassDisplayName: document.querySelector("#current-class-display").querySelector("span"),
  templateClassDropdownOpen: document.querySelector("#template-class-dropdown-option"),
  newClassButtonFunction: () => {
    classLoaderForm.resetClassID()
    categoryForm.resetCategory()
    tagForm.removeAllTags()
    // imageForm.resetInputFields()
    classForm.resetInputFields()
    warning.resetWarnings()
  },
  resetClassID: () => {
    classLoaderForm.currentClassID = ""
    classLoaderForm.currentClassDisplayName.innerHTML = "None"
    classForm.updateButton.disabled = true
    classForm.deleteButton.disabled = true
    classForm.deleteDoublecheckButton.classList.add("d-none")
    // for images
    imageFileFunctions.resetFunction()
  },
  classSelectButtonFunction: e => {
    if (!e.target.classList.contains("class-select-dropdown-item")) {
      return
    }
    for (let i = 0; i < classLoaderForm.loadedClasses.length; i++) {
      if (e.target.dataset.id == classLoaderForm.loadedClasses[i]._id) {
        classLoaderForm.currentClassID = e.target.dataset.id
        classForm.populateExistingClass({ ...classLoaderForm.loadedClasses[i] })
        classForm.updateButton.disabled = false
        classForm.deleteButton.disabled = false
        classForm.deleteDoublecheckButton.classList.add("d-none")
        // for images
        // imageFileFunctions.setCurrentClassPhotos({ ...classLoaderForm.loadedClasses[i] })
        break
      }
    }
  },
  populateOptions: _classes => {
    classLoaderForm.classLoaderDropdownHolder.innerHTML = ""
    _classes.forEach(item => {
      let newItem = classLoaderForm.templateClassDropdownOpen.content.cloneNode(true)
      // what actually gets clicked on
      let eTarget = newItem.querySelector(".dropdown-item")

      eTarget.innerHTML = item.name
      eTarget.dataset.id = item._id

      if (classLoaderForm.checkClassFormMissingCategoryOrTag(item)) {
        eTarget.classList.add("dropdown-item--warning")
      }

      classLoaderForm.classLoaderDropdownHolder.append(newItem)
    })
  },
  checkClassFormMissingCategoryOrTag: _class => {
    let problemDetected = false
    // check categories
    if (
      categoryForm.totalCategoryList.findIndex(obj => {
        return obj.name == _class.category
      }) === -1
    ) {
      problemDetected = true
    }
    // check tags
    if (problemDetected === false) {
      let noMatchingTags = true
      _class.tags.forEach(tag => {
        if (
          tagForm.totalTagList.findIndex(obj => {
            return obj.name == tag
          }) > -1
        ) {
          noMatchingTags = false
        }
      })
      problemDetected = noMatchingTags
    }
    return problemDetected
  },
  fetchData: () => {
    getAllClasses(data => {
      classLoaderForm.loadedClasses = data
      classLoaderForm.populateOptions(classLoaderForm.loadedClasses)
    })
  },
  enableButtonFunctions: () => {
    classLoaderForm.newClassButton.addEventListener("click", classLoaderForm.newClassButtonFunction)
    classLoaderForm.fetchData()
  },
}
