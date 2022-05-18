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
    imageForm.resetInputFields()
    classForm.resetInputFields()
    warning.resetWarnings()
  },
  resetClassID: () => {
    classLoaderForm.currentClassID = ""
    classLoaderForm.currentClassDisplayName.innerHTML = "None"
    classForm.updateButton.disabled = true
    classForm.deleteButton.disabled = true
    classForm.deleteDoublecheckButton.classList.add("d-none")
  },
  classSelectButtonFunction: e => {
    if (!e.target.classList.contains("class-select-dropdown-item")) {
      return
    }
    for (let i = 0; i < classLoaderForm.loadedClasses.length; i++) {
      if (e.target.dataset.id == classLoaderForm.loadedClasses[i]._id) {
        classLoaderForm.currentClassID = e.target.dataset.id
        classForm.populateExistingClass(classLoaderForm.loadedClasses[i])
        classForm.updateButton.disabled = false
        classForm.deleteButton.disabled = false
        classForm.deleteDoublecheckButton.classList.add("d-none")
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

      classLoaderForm.classLoaderDropdownHolder.append(newItem)
    })
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
