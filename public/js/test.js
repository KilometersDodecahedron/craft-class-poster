const testButton = document.querySelector("#general-testing-button")
const testHolder = document.querySelector("#general-testing-holder")

testButton.addEventListener("click", e => {
  // let url = URL.createObjectURL(imageFileFunctions.mainImageHolder)
  // testHolder.appendChild(
  //   imageFileFunctions.imagePreview.create(
  //     //   imageFileFunctions.linkPrefix + "11-3-bodyButter.jpeg",
  //     url,
  //     "Testing to see if it this works"
  //   )
  // )
  let totalPhotos = []
  totalPhotos.push(imageFileFunctions.mainImage.file)
  imageFileFunctions.additionalImages.array.forEach((item, index) => {
    totalPhotos.push(item.file)
  })
  imageFileFunctions.postImagesToServer(totalPhotos)
})
