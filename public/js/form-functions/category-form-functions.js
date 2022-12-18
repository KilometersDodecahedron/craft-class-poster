const categoryForm = {
  currentCategory: "",
  totalCategoryList: [],
  select: document.querySelector("#category-select"),
  submit: document.querySelector("#category-submit"),
  delete: document.querySelector("#category-delete"),
  displayHolder: document.querySelector("#category-selected--holder"),
  categoryDisplayTemplate: document.querySelector("#template-category-selected"),
  fetchTotalCategories: () => {
    getAllCategories(data => {
      categoryForm.totalCategoryList = data
      categoryForm.populateOptions()
    })
  },
  populateOptions: () => {
    let optionListHolder = categoryForm.select.querySelector(".form-select")
    let optionDeleteHolder = categoryForm.delete.querySelector(".form-select")
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
  },
  xButtonFunction: e => {
    if (!e.target.classList.contains("category-selected--x-button")) return
    categoryForm.resetCategory()
  },
  // called by Select Class
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
  submitCategoryMethod: () => {
    const submitField = categoryForm.submit.querySelector("input")
    const newCategoryText = submitField.value
    let checkingIfAlreadyUsed = false
    for (let i = 0; i < categoryForm.currentCategory.length; i++) {
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
    deleteCategory(selectedCategoryID, data => {
      categoryForm.fetchTotalCategories()
      deleteField.value = "Choose..."
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
  },
  resetCategory: () => {
    categoryForm.displayHolder.innerHTML = ""
    categoryForm.currentCategory = ""
  },
}
