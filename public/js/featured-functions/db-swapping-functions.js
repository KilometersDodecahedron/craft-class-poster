const dbSwapping = {
  mediaSliderText: "Swap to Featured Media Sliders",
  classUploaderText: "Swap to Class Uploader",
  onClassUploader: true,
  swapButton: document.querySelector("#swap-button"),
  classUploaderHolder: document.querySelector("#holder--class-uploader"),
  featuredUploaderHolder: document.querySelector("#holder--featured-uploader"),
  startFunctions: () => {
    dbSwapping.swapButton.addEventListener("click", dbSwapping.swapButtonFunction)
  },
  swapButtonFunction: e => {
    {
      if (dbSwapping.onClassUploader) {
        classForm.showOverlay()
        featuredDropdown.populateOptions()
        dbSwapping.classUploaderHolder.classList.add("d-none")
        dbSwapping.featuredUploaderHolder.classList.remove("d-none")
        dbSwapping.swapButton.innerHTML = dbSwapping.classUploaderText
        dbSwapping.onClassUploader = false
      } else {
        dbSwapping.classUploaderHolder.classList.remove("d-none")
        dbSwapping.featuredUploaderHolder.classList.add("d-none")
        dbSwapping.swapButton.innerHTML = dbSwapping.mediaSliderText

        dbSwapping.onClassUploader = true
      }
    }
  },
}
