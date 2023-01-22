const featuredSelected = {
  cantSubmitCSS: "featured-selected--cant-submitt",
  // what's in the database
  featuredDBArray: [],
  // what's on the page
  featuredDisplayArray: [],
  holder: document.querySelector("#featured-ul"),
  setButton: document.querySelector("#featured-selected--set-as-display-button"),
  revertButton: document.querySelector("#featured-selected--revert-button"),
  itemTemplate: document.querySelector("#featured-selected--item-template"),
  startFunctions: () => {
    featuredSelected.enableButtonFunctions()
  },
  addToDisplayArray: data => {
    if (
      featuredSelected.featuredDisplayArray.find(item => item.value === data.value) &&
      featuredSelected.featuredDisplayArray.find(item => item.key === data.key) &&
      data.value != "Price" &&
      data.value != "Experience Level" &&
      data.value != "Age Group"
    )
      return
    featuredSelected.holder.innerHTML = ""
    data.index = featuredSelected.featuredDisplayArray.length
    featuredSelected.featuredDisplayArray.push(data)
    featuredSelected.populateDisplayArray()
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  populateDBArray: () => {
    // TODO write function to poulate array from database at start
    // then have it convert that data into the featuredDisplayArray format
    dbSwapping.swapButton.disabled = true
    getAllFeatured(dbArray => {
      featuredSelected.featuredDBArray = []
      featuredSelected.featuredDisplayArray = []
      dbArray.forEach(item => {
        featuredSelected.featuredDBArray.push(featuredSelected.convertDBToDisplay(item))
      })
      featuredSelected.featuredDBArray = featuredSelected.featuredDBArray.sort((a, b) =>
        a.index > b.index ? 1 : -1
      )
      featuredSelected.featuredDisplayArray = [...featuredSelected.featuredDBArray]
      featuredSelected.populateDisplayArray()
      classForm.hideOverlay()
      dbSwapping.swapButton.disabled = false
    })
  },
  populateDisplayArray: () => {
    featuredSelected.holder.innerHTML = ""
    for (let i = 0; i < featuredSelected.featuredDisplayArray.length; i++) {
      featuredSelected.createItemFromTemplate(featuredSelected.featuredDisplayArray[i])
    }
  },
  checkboxFunction: e => {
    featuredSelected.featuredDisplayArray[e.target.dataset.index].randomize = e.target.checked
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  upButtonFunction: e => {
    let parent = e.target.closest(".featured-selected")
    let index = parseInt(parent.dataset.index)
    let targetEntry = featuredSelected.featuredDisplayArray[index]
    let aboveTarget = featuredSelected.featuredDisplayArray[index - 1]
    targetEntry.index = targetEntry.index - 1
    aboveTarget.index = aboveTarget.index + 1
    featuredSelected.featuredDisplayArray = featuredSelected.featuredDisplayArray.sort((a, b) =>
      a.index > b.index ? 1 : -1
    )
    featuredSelected.populateDisplayArray()
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  downButtonFunction: e => {
    let parent = e.target.closest(".featured-selected")
    let index = parseInt(parent.dataset.index)
    let targetEntry = featuredSelected.featuredDisplayArray[index]
    let belowTarget = featuredSelected.featuredDisplayArray[index + 1]
    targetEntry.index = targetEntry.index + 1
    belowTarget.index = belowTarget.index - 1
    featuredSelected.featuredDisplayArray = featuredSelected.featuredDisplayArray.sort((a, b) =>
      a.index > b.index ? 1 : -1
    )
    featuredSelected.populateDisplayArray()
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  xButtonFunction: e => {
    let parent = e.target.closest(".featured-selected")
    let index = parseInt(parent.dataset.index)
    // remove entry
    featuredSelected.featuredDisplayArray = featuredSelected.featuredDisplayArray.filter(
      x => x.index !== index
    )
    // adjust indexes of remaining entries
    let aboveEntries = featuredSelected.featuredDisplayArray.filter(x => x.index > index)
    if (aboveEntries.length > 0) {
      aboveEntries.forEach(item => {
        item.index = item.index - 1
      })
    }
    featuredSelected.populateDisplayArray()
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  setButtonFunction: () => {
    if (featuredSelected.checkAllDisplayedAreValid()) return
    let _newMediaSliderArray = []
    featuredSelected.featuredDisplayArray.forEach(item => {
      _newMediaSliderArray.push(featuredSelected.convertDisplayToDB(item))
    })
    classForm.showOverlay()
    featuredSelected.enableDisableSetRevertButtons(true)

    deleteAllFeatured(response => {
      _newMediaSliderArray.forEach(entry => {
        // let jsonEntry = entry.stringify()
        postFeatured(entry, data => {
          classForm.hideOverlay()
        })
      })
    })
  },
  checkAllDisplayedAreValid: () => {
    let invalidEntry = false
    featuredSelected.featuredDisplayArray.forEach(item => {
      // check if no classes fit the criteriea
      if (item.number <= 0) invalidEntry = true

      // check if the category/tag to display has been deleted
      if (item.key === "category") {
        if (
          featuredDropdown.categoryArray.findIndex(_category => {
            return _category === item.value
          }) == -1
        ) {
          console.log(featuredDropdown.categoryArray)
          invalidEntry = true
        }
      } else if (item.key === "tag") {
        if (
          featuredDropdown.tagArray.findIndex(_tag => {
            return _tag === item.value
          }) == -1
        ) {
          invalidEntry = true
        }
      }
    })

    // check that at least 1 field has been selected
    if (featuredSelected.featuredDisplayArray.length === 0) invalidEntry = true

    return invalidEntry
  },
  convertDisplayToDB: entry => {
    let _newEntry = {}
    _newEntry.type = entry.key
    _newEntry.mainData = entry.value
    if (entry.hasOwnProperty("parameter")) {
      _newEntry.secondaryData = entry.parameter
    }
    _newEntry.displayNumber = entry.index
    _newEntry.randomizeOrder = entry.randomize

    return _newEntry
  },
  convertDBToDisplay: entry => {
    let _newDisplay = {}
    _newDisplay.key = entry.type
    _newDisplay.value = entry.mainData
    if (entry.hasOwnProperty("secondaryData")) {
      _newDisplay.parameter = entry.secondaryData
      if (entry.mainData == "Price") {
        _newDisplay.parameter = parseInt(_newDisplay.parameter)
      }
    }

    _newDisplay.index = entry.displayNumber
    _newDisplay.randomize = entry.randomizeOrder
    if (entry.type === "category") {
      _newDisplay.number = featuredDropdown.getNumberOfClassesWithThatCategoryOrTag(
        entry.mainData,
        true
      )
    } else if (entry.type === "tag") {
      _newDisplay.number = featuredDropdown.getNumberOfClassesWithThatCategoryOrTag(
        entry.mainData,
        false
      )
    }
    // the specific "other" cases
    else if (entry.type === "other" && entry.mainData === "Best Sellers") {
      let numberOfFeatured = 0
      featuredDropdown.classArray.forEach(classEntry => {
        if (classEntry.featured) numberOfFeatured++
      })
      _newDisplay.number = numberOfFeatured
    } else if (entry.type === "other" && entry.mainData === "Price") {
      let numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
        x => x.price.priceForSearchFunction.lowRange <= _newDisplay.parameter
      ).length
      _newDisplay.number = numberOfClassesThatFitParameter
    } else if (entry.type === "other" && entry.mainData === "Age Group") {
      let numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(x => {
        if (_newDisplay.parameter == "adult") {
          return x.ageGroup.adult === true
        } else if (_newDisplay.parameter == "child") {
          return x.ageGroup.child === true
        } else if (_newDisplay.parameter == "mixed") {
          return x.ageGroup.mixed === true
        }
      }).length
      _newDisplay.number = numberOfClassesThatFitParameter
    }

    return _newDisplay
  },
  revertButtonFunction: () => {
    classForm.showOverlay()
    featuredSelected.populateDBArray()
    featuredSelected.enableDisableSetRevertButtons(true)
  },
  enableDisableSetRevertButtons: _disable => {
    featuredSelected.setButton.disabled = _disable
    featuredSelected.revertButton.disabled = _disable
    if (!_disable) {
      featuredSelected.setButton.disabled = featuredSelected.checkAllDisplayedAreValid()
    }
  },
  // runs when the value of the input field changes
  numberInputFieldInputFunction: e => {
    parent = e.target.closest(".featured-selected")
    entry = featuredSelected.featuredDisplayArray[parent.dataset.index]
    entry.parameter = parseInt(e.target.value)
    let numberDisplay = parent.querySelector(".featured-selected--results-display")
    let numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
      x => x.price.priceForSearchFunction.lowRange <= entry.parameter
    ).length
    entry.number = numberOfClassesThatFitParameter
    numberDisplay.innerHTML = numberOfClassesThatFitParameter
    // change color for warning
    if (isNaN(numberOfClassesThatFitParameter) || numberOfClassesThatFitParameter == 0) {
      parent.classList.add(featuredSelected.cantSubmitCSS)
    } else {
      parent.classList.remove(featuredSelected.cantSubmitCSS)
    }
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  dropdownInputFieldFunction: e => {
    parent = e.target.closest(".featured-selected")
    entry = featuredSelected.featuredDisplayArray[parent.dataset.index]
    entry.parameter = e.target.value
    let numberDisplay = parent.querySelector(".featured-selected--results-display")
    let numberOfClassesThatFitParameter = "Error"
    if (entry.value == "Age Group") {
      numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(x => {
        if (entry.parameter == "adult") {
          return x.ageGroup.adult === true
        } else if (entry.parameter == "child") {
          return x.ageGroup.child === true
        } else if (entry.parameter == "mixed") {
          return x.ageGroup.mixed === true
        }
      }).length
    } else if (entry.value == "Experience Level") {
      numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
        x => x.difficulty == entry.parameter
      ).length
    }

    entry.number = numberOfClassesThatFitParameter
    numberDisplay.innerHTML = numberOfClassesThatFitParameter
    // change color for warning
    if (isNaN(numberOfClassesThatFitParameter) || numberOfClassesThatFitParameter == 0) {
      parent.classList.add(featuredSelected.cantSubmitCSS)
    } else {
      parent.classList.remove(featuredSelected.cantSubmitCSS)
    }
    featuredSelected.enableDisableSetRevertButtons(false)
  },
  createItemFromTemplate: data => {
    // TODO set IDs of items for functionality
    let _newItem = featuredSelected.itemTemplate.content.cloneNode(true)
    let componentsToTurnOnAndOff = {
      randomizeCheckbox: _newItem.querySelector(".featured-selected--randomize-checkbox--holder"),
      numberInput: _newItem.querySelector(".featured-selected--number"),
      dropdown: _newItem.querySelector(".featured-selected--dropdown-option--holder"),
      upButton: _newItem.querySelector(".featured-selected--up-button"),
      downButton: _newItem.querySelector(".featured-selected--down-button"),
      totalClassesDisplay: _newItem.querySelector(".featured-selected--total-classes-display"),
    }

    // set IDs
    componentsToTurnOnAndOff.randomizeCheckbox
      .querySelector(".featured-selected--randomize-checkbox")
      .setAttribute("id", `featured-${data.index}`)
    componentsToTurnOnAndOff.randomizeCheckbox
      .querySelector("label")
      .setAttribute("for", `featured-${data.index}`)

    if (data.index === 0) {
      componentsToTurnOnAndOff.upButton.classList.add("d-none")
    }

    if (data.index == featuredSelected.featuredDisplayArray.length - 1) {
      componentsToTurnOnAndOff.downButton.classList.add("d-none")
    }
    componentsToTurnOnAndOff.randomizeCheckbox
      .querySelector("input[type=checkbox]")
      .setAttribute("data-index", data.index)

    _newItem.querySelector(".featured-selected").setAttribute("data-index", data.index)

    // preserves whether randomize was selected
    if (data.randomize) {
      componentsToTurnOnAndOff.randomizeCheckbox.querySelector(
        "input[type=checkbox]"
      ).checked = true
    }

    let dataDisplayComponents = {
      nameDisplay: _newItem.querySelector(".featured-selected--name"),
      numberDisplay: _newItem.querySelector(".featured-selected--results-display"),
    }
    // categories and tags
    if (data.key === "category" || data.key === "tag") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      dataDisplayComponents.numberDisplay.innerHTML = data.number
      // check if the category/tag has been deleted
      if (data.key === "category") {
        // TODO check against
        if (
          featuredDropdown.categoryArray.findIndex(_category => {
            return _category === data.value
          }) == -1
        ) {
          _newItem.querySelector(".featured-selected").classList.add(featuredSelected.cantSubmitCSS)
          dataDisplayComponents.numberDisplay.innerHTML = "CATEGORY DELETED"
        }
      } else if (data.key === "tag") {
        // TODO check against
        if (
          featuredDropdown.tagArray.findIndex(_tag => {
            return _tag === data.value
          }) == -1
        ) {
          _newItem.querySelector(".featured-selected").classList.add(featuredSelected.cantSubmitCSS)
          dataDisplayComponents.numberDisplay.innerHTML = "TAG DELETED"
        }
        // _newItem.querySelector(".featured-selected").classList.add(featuredSelected.cantSubmitCSS)
      }
    }
    // best sellers
    else if (data.key === "other" && data.value === "Best Sellers") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      dataDisplayComponents.numberDisplay.innerHTML = data.number
    }
    // Popular
    else if (data.key === "other" && data.value === "Popular") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      let numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
        x => x.numberOfInquiriesSent > 0
      ).length
      dataDisplayComponents.numberDisplay.innerHTML = numberOfClassesThatFitParameter

      featuredSelected.featuredDisplayArray[data.index].number = numberOfClassesThatFitParameter
      componentsToTurnOnAndOff.randomizeCheckbox.classList.add("d-none")
    }
    // Newest
    else if (data.key === "other" && data.value === "Newest") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      componentsToTurnOnAndOff.totalClassesDisplay.classList.add("d-none")
      componentsToTurnOnAndOff.randomizeCheckbox.classList.add("d-none")
    }
    // Price
    else if (data.key === "other" && data.value === "Price") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      componentsToTurnOnAndOff.numberInput.setAttribute("placeholder", "Max Price Displayed")
      componentsToTurnOnAndOff.numberInput.classList.remove("d-none")
      // carry values after reorder array
      if (featuredSelected.featuredDisplayArray[data.index].parameter) {
        componentsToTurnOnAndOff.numberInput.value =
          featuredSelected.featuredDisplayArray[data.index].parameter
        let numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
          x =>
            x.price.priceForSearchFunction.lowRange <=
            featuredSelected.featuredDisplayArray[data.index].parameter
        ).length
        dataDisplayComponents.numberDisplay.innerHTML = numberOfClassesThatFitParameter
      }
    }
    // Experience Level Display
    else if (data.key === "other" && data.value === "Experience Level") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      componentsToTurnOnAndOff.dropdown.classList.remove("d-none")
      let dropdown = _newItem.querySelector(".form-select")
      dropdown.innerHTML = ""
      // create options
      let beginnerOption = document.createElement("option")
      beginnerOption.value = "Beginner"
      beginnerOption.innerHTML = "Beginner"
      beginnerOption.selected = true
      dropdown.append(beginnerOption)
      let intermediateOption = document.createElement("option")
      intermediateOption.value = "Intermediate"
      intermediateOption.innerHTML = "Intermediate"
      dropdown.append(intermediateOption)
      let advancedOption = document.createElement("option")
      advancedOption.value = "Advanced"
      advancedOption.innerHTML = "Advanced"
      dropdown.append(advancedOption)

      // carry values after reorder array
      if (featuredSelected.featuredDisplayArray[data.index].parameter) {
        let entry = featuredSelected.featuredDisplayArray[data.index]
        let numberOfClassesThatFitParameter = "Error"

        if (entry.parameter == "Intermediate") {
          beginnerOption.selected = false
          intermediateOption.selected = true
        } else if (entry.parameter == "Advanced") {
          beginnerOption.selected = false
          advancedOption.selected = true
        }

        numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
          x => x.difficulty === entry.parameter
        ).length
        entry.number = numberOfClassesThatFitParameter
        dataDisplayComponents.numberDisplay.innerHTML = numberOfClassesThatFitParameter
      } else {
        featuredSelected.featuredDisplayArray[data.index].parameter = "Beginner"
        // default show adult values
        numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
          x => x.difficulty === featuredSelected.featuredDisplayArray[data.index].parameter
        ).length
        featuredSelected.featuredDisplayArray[data.index].number = numberOfClassesThatFitParameter
        dataDisplayComponents.numberDisplay.innerHTML = numberOfClassesThatFitParameter
      }
    }
    // Age Group
    else if (data.key === "other" && data.value === "Age Group") {
      dataDisplayComponents.nameDisplay.innerHTML = `${data.value} (${data.key})`
      componentsToTurnOnAndOff.dropdown.classList.remove("d-none")
      let dropdown = _newItem.querySelector(".form-select")
      dropdown.innerHTML = ""
      // create options
      let adultOption = document.createElement("option")
      adultOption.value = "adult"
      adultOption.innerHTML = "Adult"
      adultOption.selected = true
      dropdown.append(adultOption)
      let childOption = document.createElement("option")
      childOption.value = "child"
      childOption.innerHTML = "Child"
      dropdown.append(childOption)
      let mixedOption = document.createElement("option")
      mixedOption.value = "mixed"
      mixedOption.innerHTML = "Mixed"
      dropdown.append(mixedOption)

      // carry values after reorder array
      if (featuredSelected.featuredDisplayArray[data.index].parameter) {
        let entry = featuredSelected.featuredDisplayArray[data.index]
        let numberOfClassesThatFitParameter = "Error"
        numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(x => {
          if (entry.parameter == "adult") {
            return x.ageGroup.adult === true
          } else if (entry.parameter == "child") {
            adultOption.selected = false
            childOption.selected = true
            return x.ageGroup.child === true
          } else if (entry.parameter == "mixed") {
            adultOption.selected = false
            mixedOption.selected = true
            return x.ageGroup.mixed === true
          }
        }).length
        dataDisplayComponents.numberDisplay.innerHTML = numberOfClassesThatFitParameter
      } else {
        featuredSelected.featuredDisplayArray[data.index].parameter = "adult"
        // default show adult values
        let numberOfClassesThatFitParameter = classLoaderForm.loadedClasses.filter(
          x => x.ageGroup.adult === true
        ).length
        featuredSelected.featuredDisplayArray[data.index].number = numberOfClassesThatFitParameter
        dataDisplayComponents.numberDisplay.innerHTML = numberOfClassesThatFitParameter
      }
    }

    let finalClassCount = featuredSelected.featuredDisplayArray[data.index].number
    // change color for warning
    if (
      featuredSelected.featuredDisplayArray[data.index].value != "Newest" &&
      featuredSelected.featuredDisplayArray[data.index].value != "other"
    ) {
      if (isNaN(finalClassCount) || finalClassCount == 0) {
        _newItem.querySelector(".featured-selected").classList.add(featuredSelected.cantSubmitCSS)
      }
    }

    featuredSelected.holder.append(_newItem)
  },
  enableButtonFunctions: () => {
    featuredSelected.setButton.addEventListener("click", e => featuredSelected.setButtonFunction(e))
    featuredSelected.revertButton.addEventListener("click", e =>
      featuredSelected.revertButtonFunction(e)
    )
    document.addEventListener("click", e => {
      if (e.target.classList.contains("featured-selected--randomize-checkbox")) {
        featuredSelected.checkboxFunction(e)
      } else if (e.target.classList.contains("featured-selected--up-button")) {
        featuredSelected.upButtonFunction(e)
      } else if (e.target.classList.contains("featured-selected--down-button")) {
        featuredSelected.downButtonFunction(e)
      } else if (e.target.classList.contains("featured-selected--x-button")) {
        featuredSelected.xButtonFunction(e)
      }
    })
    document.addEventListener("input", e => {
      if (e.target.classList.contains("featured-selected--number")) {
        featuredSelected.numberInputFieldInputFunction(e)
      } else if (e.target.classList.contains("featured-selected--dropdown-option")) {
        featuredSelected.dropdownInputFieldFunction(e)
      }
    })
  },
}
