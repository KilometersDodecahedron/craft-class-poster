const HELPER_convertImageFileToBase64String = (file, callback) => {
  let base64String = ""
  var reader = new FileReader()

  reader.onload = function () {
    base64String = reader.result.replace("data:", "").replace(/^.+,/, "")
    callback(base64String)
  }

  reader.readAsDataURL(file)
}

const INTERNAL_isOverflown = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }) =>
  scrollWidth > clientWidth || scrollHeight > clientHeight

const HELPER_resizeText = ({
  element,
  elements,
  minSize = 10,
  maxSize = 512,
  step = 1,
  unit = "px",
}) => {
  ;(elements || [element]).forEach(el => {
    let i = minSize
    let overflow = false

    const parent = el.parentNode

    el.setAttribute("backgroud-color", "red")
    while (!overflow && i < maxSize) {
      el.style.fontSize = `${i}${unit}`
      overflow = INTERNAL_isOverflown(parent)

      if (!overflow) i += step
    }

    // revert to last state where no overflow happened
    el.style.fontSize = `${i - step}${unit}`
  })
}

const HELPER_removeExtraLineBreaks = _text => {
  let newText = _text.replaceAll("<p><br></p>", "")
  return newText
}
