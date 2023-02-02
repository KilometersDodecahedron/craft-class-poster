const tagForm = {
  selectedTagList: [],
  totalTagList: [],
  select: document.querySelector("#tag-select"),
  submit: document.querySelector("#tag-submit"),
  delete: document.querySelector("#tag-delete"),
  displayHolder: document.querySelector("#tag-selected--holder"),
  tagDisplayTemplate: document.querySelector("#template-tag-selected"),
  tagMissingDisplayTemplate: document.querySelector("#template-tag-missing-warning"),
  fetchTotalTags: _callback => {
    getAllTags(data => {
      tagForm.totalTagList = data
      tagForm.populateOptions()
      if (_callback) {
        _callback(data)
      }
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
    tagForm.addCurrentTag(selectedTag)
    // tagForm.createTagDisplayFromTemplate(selectedTag)
    tagForm.populateCurrentTags()
    selectField.value = "Choose..."
  },
  createTagDisplayFromTemplate: (selectedTag, index) => {
    let newTagDisplay = tagForm.tagDisplayTemplate.content.cloneNode(true)
    let tagBackground = newTagDisplay.querySelector(".tag-selected--display")
    let nameDisplay = newTagDisplay.querySelector(".tag-selected--name")
    let closeButton = newTagDisplay.querySelector(".tag-selected--x-button")
    let displayButton = newTagDisplay.querySelector(".tag-selected--display-button")
    nameDisplay.innerHTML = selectedTag
    // the tag is stored in the data attribute of the close button it can be removed from the list if x is clicked
    closeButton.setAttribute("data-tag", selectedTag)
    displayButton.setAttribute("data-tag", selectedTag)

    // set first index as display tag
    if (index == 0) {
      displayButton.classList.add("d-none")
      tagBackground.classList.add("tag-selected--display--main")
    }

    tagForm.displayHolder.append(newTagDisplay)
  },
  dbCallbackMethod: data => {
    featuredDropdown.populateOptions()
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
          submitField.value = ""
          tagForm.fetchTotalTags()
          tagForm.dbCallbackMethod()
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
    const deletedTagName = deleteField.querySelector(`[value="${selectedTagID}"]`).innerHTML
    // TODO check if Tag is active, then delete
    deleteTag(selectedTagID, data => {
      tagForm.fetchTotalTags(() => {
        classLoaderForm.populateOptions(classLoaderForm.loadedClasses)
      })
      deleteField.value = "Choose..."
      tagForm.dbCallbackMethod()
      let modifiedSelectedTagList = []
      tagForm.selectedTagList.forEach(tag => {
        if (tag != deletedTagName) {
          modifiedSelectedTagList.push(tag)
        }
      })
      tagForm.selectedTagList = modifiedSelectedTagList
      tagForm.populateCurrentTags()
    })
    console.log(tagForm.selectedTagList)
  },
  xButtonFunction: e => {
    if (e.target.classList.contains("tag-selected--x-button")) {
      const tagHolder = e.target.parentElement
      const currentTag = tagHolder.querySelector("span").innerHTML
      tagForm.removeCurrentTag(currentTag)
      tagForm.populateCurrentTags()
    }
  },
  displayButtonFunction: e => {
    if (e.target.classList.contains("tag-selected--display-button")) {
      for (let i = 0; i < tagForm.selectedTagList.length; i++) {
        if (e.target.dataset.tag == tagForm.selectedTagList[i]) {
          let newMainTag = tagForm.selectedTagList.splice(i, 1)
          // tagForm.selectedTagList.unshift(newMainTag)
          tagForm.selectedTagList = [...newMainTag, ...tagForm.selectedTagList]
          tagForm.populateCurrentTags()
          console.log(tagForm.selectedTagList)
        }
      }
    }
  },
  // called by form-functions
  determineWhichTagsHaveBeenDeleted: tagList => {
    let remainingTags = []
    console.log(tagList)
    console.log(tagForm.totalTagList)
    for (let i = 0; i < tagList.length; i++) {
      if (
        tagForm.totalTagList.findIndex(obj => {
          return obj.name == tagList[i]
        }) > -1
      ) {
        remainingTags.push(tagList[i])
      }
    }
    tagForm.selectedTagList = remainingTags
    console.log(remainingTags)

    if (tagForm.selectedTagList.length > 0) {
      tagForm.populateCurrentTags()
    } else {
      tagForm.createDeletedTagWarning()
    }
  },
  // called by determineWhichTagsHaveBeenDeleted
  createDeletedTagWarning: () => {
    tagForm.displayHolder.innerHTML = ""
    let createdWarning = tagForm.tagMissingDisplayTemplate.content.cloneNode(true)
    tagForm.displayHolder.append(createdWarning)
  },
  populateCurrentTags: () => {
    tagForm.displayHolder.innerHTML = ""
    for (let i = 0; i < tagForm.selectedTagList.length; i++) {
      tagForm.createTagDisplayFromTemplate(tagForm.selectedTagList[i], i)
    }
    changeChecker.changeFunction()
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
