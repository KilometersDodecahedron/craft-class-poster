const featuredSelected = {
  // what's in the database
  featuredCurrentArray: [],
  // what's on the page
  featuredActiveArray: [],
  holder: document.querySelector("#featured-ul"),
  itemTemplate: document.querySelector("#featured-selected--item-template"),
  startFunctions: () => {
    console.log(featuredSelected)
    // TODO remove test function
    testButton = document.createElement("button")
    testButton.textContent = "Test Button, added in featuredSelected.startFunctions()"
    testButton.addEventListener("click", () => {
      newItem = featuredSelected.createItemFromTemplate()
      featuredSelected.holder.append(newItem)
    })
    featuredSelected.holder.after(testButton)
    // TODO remove test function
  },
  createItemFromTemplate: data => {
    let _newItem = featuredSelected.itemTemplate.content.cloneNode(true)
    let componentsToTurnOnAndOff = {
      randomizeCheckbox: _newItem.querySelector(".featured-selected--randomize-checkbox--holder"),
      numberInput: _newItem.querySelector(".featured-selected--number"),
      dropdown: _newItem.querySelector(".featured-selected--dropdown-option--holder"),
    }
    console.log(componentsToTurnOnAndOff)
    return _newItem
  },
}
