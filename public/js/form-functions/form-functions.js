const tagForm = {
  selectedTagList: [],
  totalTagList: [],
  select: document.querySelector("#tag-select"),
  submit: document.querySelector("#tag-submit"),
  delete: document.querySelector("#tag-delete"),
  displayHolder: document.querySelector("#tag-selected--holder"),
  fetchTotalTags: () => {
    getAllTags(data => {
      tagForm.totalTagList = data
      tagForm.populateOptions()
    })
  },
  populateOptions: () => {},
  selectTagMethod: () => {
    const selectField = tagForm.select.querySelector("select")
    const selectedTag = selectField.value
    console.log(selectedTag)
    selectField.value = "Choose..."
  },
  submitTagMethod: () => {
    const submitField = tagForm.submit.querySelector("input")
    const newTagText = submitField.value
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
    const selectedTag = deleteField.value
    console.log(selectedTag)
    deleteField.value = "Choose..."
  },
  xButtonFunction: e => {
    if (e.target.classList.contains("tag-selected--button")) {
      const tagHolder = e.target.parentElement
      const currentTag = tagHolder.querySelector("span").innerHTML
      console.log(currentTag)
    }
  },
  enableButtonFunctions: () => {
    tagForm.select.querySelector("button").addEventListener("click", tagForm.selectTagMethod)
    tagForm.submit.querySelector("button").addEventListener("click", tagForm.submitTagMethod)
    tagForm.delete.querySelector("button").addEventListener("click", tagForm.deleteTagMethod)
  },
}

tagForm.enableButtonFunctions()
tagForm.fetchTotalTags()

document.querySelector("body").addEventListener("click", e => {
  tagForm.xButtonFunction(e)
})
