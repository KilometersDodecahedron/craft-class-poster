const imageForm = {
  mainImageUrl: {
    src: "",
    alt: "",
  },
  additionalImageUrlArray: [],
  imageDisplayTemplate: document.querySelector("#template-image-selected"),
  mainImageSubmit: {
    srcInput: document.querySelector("#main-image-submit--link"),
    altInput: document.querySelector("#main-image-submit--alt"),
    button: document.querySelector("#main-image-submit").querySelector("button"),
    close: () => {
      imageForm.mainCardHolder.innerHTML = ""
      imageForm.mainImageUrl.src = ""
      imageForm.mainImageUrl.alt = ""
    },
    method: () => {
      let src = imageForm.mainImageSubmit.srcInput.value
      let alt = imageForm.mainImageSubmit.altInput.value
      if (src != "" && alt != "") {
        imageForm.mainImageSubmit.srcInput.value = ""
        imageForm.mainImageSubmit.altInput.value = ""
        imageForm.mainImageUrl.src = src
        imageForm.mainImageUrl.alt = alt
        imageForm.mainCardHolder.innerHTML = ""
        imageForm.mainCardHolder.append(imageForm.createCardMethod(src, alt, true))
      }
    },
  },
  additionalImageSubmit: {
    srcInput: document.querySelector("#additional-image-submit--link"),
    altInput: document.querySelector("#additional-image-submit--alt"),
    button: document.querySelector("#additional-image-submit").querySelector("button"),
    close: e => {
      let targetHolder = e.target.closest(".image-card-holder")
      let targetSrc = e.target.dataset.src
      let targetAlt = e.target.dataset.alt

      imageForm.additionalImageUrlArray = imageForm.additionalImageUrlArray.filter(object => {
        return object.src != targetSrc && object.alt != targetAlt
      })

      targetHolder.remove()
    },
    method: () => {
      let src = imageForm.additionalImageSubmit.srcInput.value
      let alt = imageForm.additionalImageSubmit.altInput.value
      if (src != "" && alt != "") {
        imageForm.additionalImageSubmit.srcInput.value = ""
        imageForm.additionalImageSubmit.altInput.value = ""

        let newAdditionalEntry = {
          src: src,
          alt: alt,
        }

        imageForm.additionalImageUrlArray.push(newAdditionalEntry)
        imageForm.additionalCardHolder.append(imageForm.createCardMethod(src, alt, false))
      }
    },
  },
  mainCardHolder: document.querySelector("#main-card-holder"),
  additionalCardHolder: document.querySelector("#additional-card-holder"),
  createCardMethod: (_src, _alt, _isMain) => {
    // isMain is a bool, determines what method the x button gets
    let newCard = imageForm.imageDisplayTemplate.content.cloneNode(true)
    let closeButton = newCard.querySelector("button")
    let cardImage = newCard.querySelector("img")
    let cardText = newCard.querySelector("p")

    if (_isMain) {
      closeButton.addEventListener("click", imageForm.mainImageSubmit.close)
    } else {
      closeButton.addEventListener("click", imageForm.additionalImageSubmit.close)
      closeButton.dataset.src = _src
      closeButton.dataset.alt = _alt
    }

    cardImage.src = _src
    cardImage.alt = _alt
    cardText.innerHTML = _alt

    return newCard
  },
  resetInputFields: () => {
    imageForm.mainCardHolder.innerHTML = ""
    imageForm.additionalCardHolder.innerHTML = ""
    imageForm.mainImageUrl = { src: "", alt: "" }
    imageForm.additionalImageUrlArray = []
    imageForm.mainImageSubmit.srcInput.value = ""
    imageForm.mainImageSubmit.altInput.value = ""
    imageForm.additionalImageSubmit.srcInput.value = ""
    imageForm.additionalImageSubmit.altInput.value = ""
  },
  enableButtonFunctions: () => {
    imageForm.mainImageSubmit.button.addEventListener("click", imageForm.mainImageSubmit.method)
    imageForm.additionalImageSubmit.button.addEventListener(
      "click",
      imageForm.additionalImageSubmit.method
    )
  },
}
