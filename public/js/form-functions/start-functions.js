const startFunctionHelpers = {
  trackingNumber: 0,
  synchronizeTagsAndCategoriesWithClasses: () => {
    startFunctionHelpers.trackingNumber++
    if (startFunctionHelpers.trackingNumber >= 2) {
      startFunctionHelpers.trackingNumber = 0
      classLoaderForm.enableButtonFunctions()
    }
  },
}

inputFieldLimiter.startFunction()
categoryForm.fetchTotalCategories(startFunctionHelpers.synchronizeTagsAndCategoriesWithClasses)
categoryForm.enableButtonFunctions()
tagForm.enableButtonFunctions()
tagForm.fetchTotalTags(startFunctionHelpers.synchronizeTagsAndCategoriesWithClasses)
classForm.startFunctions()
changeChecker.startFunctions()

// imageForm.enableButtonFunctions()
// TODO set as callback
// classLoaderForm.enableButtonFunctions()

imageFileFunctions.startFunctions()

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

document.querySelector("body").addEventListener("click", e => {
  tagForm.xButtonFunction(e)
  tagForm.displayButtonFunction(e)
  classLoaderForm.classSelectButtonFunction(e)
})
