const categoryForm = {
  currentCategory: "",
  totalCategoryList: [],
  select: document.querySelector("#category-select"),
  submit: document.querySelector("#category-submit"),
  delete: document.querySelector("#category-delete"),
  rename: document.querySelector("#category-rename"),
  displayHolder: document.querySelector("#category-selected--holder"),
  categoryDisplayTemplate: document.querySelector("#template-category-selected"),
  categoryMissingDisplayTemplate: document.querySelector("#template-category-missing-warning"),
  fetchTotalCategories: _callback => {
    getAllCategories(data => {
      categoryForm.totalCategoryList = data
      categoryForm.populateOptions()
      if (_callback) {
        _callback(data)
      }
    })
  },
  populateOptions: () => {
    let optionListHolder = categoryForm.select.querySelector(".form-select")
    let optionDeleteHolder = categoryForm.delete.querySelector(".form-select")
    let optionRenameHolder = categoryForm.rename.querySelector(".form-select")
    optionListHolder.innerHTML = ""
    optionDeleteHolder.innerHTML = ""
    optionRenameHolder.innerHTML = ""

    let placeholderOption = document.createElement("option")
    placeholderOption.innerHTML = "Choose..."
    placeholderOption.value = "Choose..."
    optionListHolder.append(placeholderOption)

    let placeholderOptionDelete = document.createElement("option")
    placeholderOptionDelete.innerHTML = "Choose..."
    placeholderOptionDelete.value = "Choose..."
    optionDeleteHolder.append(placeholderOptionDelete)

    let placeholderOptionRename = document.createElement("option")
    placeholderOptionRename.innerHTML = "Choose..."
    placeholderOptionRename.value = "Choose..."
    optionRenameHolder.append(placeholderOptionRename)

    for (let i = 0; i < categoryForm.totalCategoryList.length; i++) {
      let newOption = document.createElement("option")
      newOption.innerHTML = categoryForm.totalCategoryList[i].name
      newOption.value = categoryForm.totalCategoryList[i].name
      newOption.setAttribute("data-id", categoryForm.totalCategoryList[i]._id)
      optionListHolder.append(newOption)

      let newOptionDelete = document.createElement("option")
      newOptionDelete.innerHTML = categoryForm.totalCategoryList[i].name
      newOptionDelete.value = categoryForm.totalCategoryList[i]._id
      newOptionDelete.setAttribute("data-id", categoryForm.totalCategoryList[i]._id)
      optionDeleteHolder.append(newOptionDelete)

      let newOptionRename = document.createElement("option")
      newOptionRename.innerHTML = categoryForm.totalCategoryList[i].name
      newOptionRename.value = categoryForm.totalCategoryList[i]._id
      newOptionRename.setAttribute("data-id", categoryForm.totalCategoryList[i]._id)
      optionRenameHolder.append(newOptionRename)
    }
  },
  selectCategoryMethod: () => {
    const selectField = categoryForm.select.querySelector("select")
    const selectedCategory = selectField.value
    if (selectedCategory == "Choose...") {
      selectField.value = "Choose..."
      return
    }
    categoryForm.createCategoryDisplayFromTemplate(selectedCategory)
    selectField.value = "Choose..."
    changeChecker.changeFunction()
  },
  xButtonFunction: e => {
    if (!e.target.classList.contains("category-selected--x-button")) return
    categoryForm.resetCategory()
    changeChecker.changeFunction()
  },
  // called by Select Class
  determineIfCategoryHasBeenDeletedWhenLoadingClass: selectedCategory => {
    if (
      categoryForm.totalCategoryList.findIndex(obj => {
        return obj.name == selectedCategory
      }) > -1
    ) {
      categoryForm.createCategoryDisplayFromTemplate(selectedCategory)
      // console.log("Category Exists")
    } else {
      categoryForm.createDeletedCategoryWarning(selectedCategory)
      // console.log("Category No Longer Exists")
    }
  },
  // called by determineIfCategoryHasBeenDeletedWhenLoadingClass
  createDeletedCategoryWarning: missingCategory => {
    categoryForm.displayHolder.innerHTML = ""

    let createdWarning = categoryForm.categoryMissingDisplayTemplate.content.cloneNode(true)
    let warningText = createdWarning.querySelector(".category-selected--name")
    warningText.innerHTML = warningText.innerHTML.replace("###", missingCategory)

    categoryForm.displayHolder.append(createdWarning)
  },
  createCategoryDisplayFromTemplate: selectedCategory => {
    categoryForm.displayHolder.innerHTML = ""
    categoryForm.currentCategory = selectedCategory

    let newCategoryDisplay = categoryForm.categoryDisplayTemplate.content.cloneNode(true)
    let nameDisplay = newCategoryDisplay.querySelector(".category-selected--name")
    let closeButton = newCategoryDisplay.querySelector(".category-selected--x-button")
    nameDisplay.innerHTML = selectedCategory
    // the Category is stored in the data attribute of the close button it can be removed from the list if x is clicked
    closeButton.setAttribute("data-category", selectedCategory)

    categoryForm.displayHolder.append(newCategoryDisplay)
  },
  dbCallbackMethod: data => {
    featuredDropdown.populateOptions()
  },
  submitCategoryMethod: () => {
    const submitField = categoryForm.submit.querySelector("input")
    const newCategoryText = submitField.value
    let checkingIfAlreadyUsed = false
    for (let i = 0; i < categoryForm.totalCategoryList.length; i++) {
      if (
        newCategoryText == categoryForm.totalCategoryList[i].name ||
        newCategoryText == "That one's already on the list"
      ) {
        submitField.value = "That one's already on the list"
        checkingIfAlreadyUsed = true
      }
    }
    if (checkingIfAlreadyUsed) {
      return
    }
    if (!categoryForm.totalCategoryList.includes(newCategoryText)) {
      postCategory(
        {
          name: newCategoryText,
        },
        data => {
          submitField.value = ""
          categoryForm.fetchTotalCategories()
          categoryForm.dbCallbackMethod()
        }
      )
    }
  },
  deleteCategoryMethod: () => {
    const deleteField = categoryForm.delete.querySelector("select")
    const selectedCategoryID = deleteField.value
    if (selectedCategoryID == "Choose...") {
      return
    }
    const deletedCategoryName = deleteField.querySelector(
      `[value="${selectedCategoryID}"]`
    ).innerHTML

    deleteCategory(selectedCategoryID, data => {
      categoryForm.fetchTotalCategories(() => {
        classLoaderForm.populateOptions(classLoaderForm.loadedClasses)
      })
      deleteField.value = "Choose..."
      // removes if selected
      if (categoryForm.currentCategory == deletedCategoryName) {
        categoryForm.resetCategory()
      }
      categoryForm.dbCallbackMethod()
    })
  },
  updateCategoryMethod: () => {
    const updateDropdown = categoryForm.rename.querySelector("select")
    const updateTextField = categoryForm.rename.querySelector("input")
    const newCategoryName = updateTextField.value
    const selectedCategoryID = updateDropdown.value
    if (selectedCategoryID == "Choose..." || newCategoryName == "") {
      return
    }
    if (categoryForm.totalCategoryList.findIndex(obj => obj.name == newCategoryName) != -1) {
      alert("A Category with that name already exists")
      return
    }

    const oldCategoryName = updateDropdown.querySelector(
      `[value="${selectedCategoryID}"]`
    ).innerHTML

    const structuredData = {
      newName: newCategoryName,
      oldName: oldCategoryName,
    }

    changeChecker.checkForUnsavedChanges(() => {
      updateClassCategories(structuredData, data => {
        let newData = {
          name: newCategoryName,
        }
        updateCategory(newData, selectedCategoryID, data => {
          updateDropdown.value = "Choose..."
          updateTextField.value = ""
          categoryForm.fetchTotalCategories()
          categoryForm.dbCallbackMethod()
          // let modifiedSelectedTagList = []
          // tagForm.selectedTagList = modifiedSelectedTagList
          // tagForm.populateCurrentTags()
          classLoaderForm.resetAllClassProperties()
          classLoaderForm.fetchData()
        })
      })
    })
  },
  enableButtonFunctions: () => {
    categoryForm.select.addEventListener("click", categoryForm.selectCategoryMethod)
    categoryForm.submit
      .querySelector("button")
      .addEventListener("click", categoryForm.submitCategoryMethod)
    categoryForm.delete
      .querySelector("button")
      .addEventListener("click", categoryForm.deleteCategoryMethod)
    document.addEventListener("click", categoryForm.xButtonFunction)
    categoryForm.rename
      .querySelector("button")
      .addEventListener("click", categoryForm.updateCategoryMethod)
  },
  resetCategory: () => {
    categoryForm.displayHolder.innerHTML = ""
    categoryForm.currentCategory = ""
  },
}
