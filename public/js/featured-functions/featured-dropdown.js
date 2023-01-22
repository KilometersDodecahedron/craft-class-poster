const featuredDropdown = {
  categoryHolder: document.querySelector("#featured-dropdown--category-holder"),
  tagHolder: document.querySelector("#featured-dropdown--tag-holder"),
  otherHolder: document.querySelector("#featured-dropdown--other-holder"),
  categoryItemTemplate: document.querySelector("#featured-dropdown--category-template"),
  tagItemTemplate: document.querySelector("#featured-dropdown--tag-template"),
  categoryArray: [],
  tagArray: [],
  otherOptionsArray: [
    "Popular",
    "Price",
    "Experience Level",
    "Age Group",
    "Newest",
    "Best Sellers",
  ],
  classArray: [],
  getNumberOfClassesWithThatCategoryOrTag: (value, typeCategory) => {
    let num = 0
    if (typeCategory) {
      featuredDropdown.classArray.forEach(item => {
        if (item.category == value) num++
      })
    } else {
      featuredDropdown.classArray.forEach(item => {
        if (item.tags.includes(value)) num++
      })
    }

    return num
  },
  createFromTemplate: {
    category: (_name, _number) => {
      let newItem = featuredDropdown.categoryItemTemplate.content.cloneNode(true)
      let nameDisplay = newItem.querySelector(".featured-dropdown--item")
      let numberDisplay = newItem.querySelector(".featured-dropdown--item-number")

      let dataHolder = newItem.querySelector(".dropdown-item")
      dataHolder.setAttribute("data-value", _name)
      dataHolder.setAttribute("data-number", _number)

      nameDisplay.innerHTML = _name
      numberDisplay.innerHTML = `(${_number})`

      return newItem
    },
    tag: (_name, _number) => {
      let newItem = featuredDropdown.tagItemTemplate.content.cloneNode(true)
      let nameDisplay = newItem.querySelector(".featured-dropdown--item")
      let numberDisplay = newItem.querySelector(".featured-dropdown--item-number")

      let dataHolder = newItem.querySelector(".dropdown-item")
      dataHolder.setAttribute("data-value", _name)
      dataHolder.setAttribute("data-number", _number)

      nameDisplay.innerHTML = _name
      numberDisplay.innerHTML = `(${_number})`

      return newItem
    },
    other: (_name, _number) => {},
  },
  selectClickFunction: {
    master: _target => {
      key = _target.dataset.key
      value = _target.dataset.value
      if (key == "category") {
        featuredDropdown.selectClickFunction.category(_target)
      } else if (key == "tag") {
        featuredDropdown.selectClickFunction.tag(_target)
      } else if (key == "other") {
        featuredDropdown.selectClickFunction.other(_target)
      }
    },
    category: _target => {
      number = _target.dataset.number
      featuredSelected.addToDisplayArray({
        key: key,
        value: value,
        number: parseInt(number),
        randomize: false,
      })
    },
    tag: _target => {
      number = _target.dataset.number
      featuredSelected.addToDisplayArray({
        key: key,
        value: value,
        number: parseInt(number),
        randomize: false,
      })
    },
    other: _target => {
      console.log("other")
      number = _target.dataset.number
      featuredSelected.addToDisplayArray({
        key: key,
        value: value,
        number: parseInt(number),
        randomize: false,
      })
    },
  },
  populateOptions: () => {
    getAllClasses(_classData => {
      featuredDropdown.classArray = _classData

      let numberOfFeatured = 0
      featuredDropdown.classArray.forEach(classEntry => {
        if (classEntry.featured) numberOfFeatured++
      })

      // display # of best sellers
      document.querySelector(
        "#featured-dropdown--best-sellers-number"
      ).innerHTML = `(${numberOfFeatured})`

      // store  # of best sellers on element
      document
        .querySelector("[data-value='Best Sellers']")
        .setAttribute("data-number", numberOfFeatured)

      console.log(document.querySelector("[data-value='Best Sellers']"))

      getAllCategories(_categoryData => {
        featuredDropdown.categoryHolder.innerHTML = ""
        featuredDropdown.categoryArray = []
        _categoryData.forEach(item => {
          featuredDropdown.categoryArray.push(item.name)
          featuredDropdown.categoryHolder.append(
            featuredDropdown.createFromTemplate.category(
              item.name,
              featuredDropdown.getNumberOfClassesWithThatCategoryOrTag(item.name, true)
            )
          )
        })
      })
      getAllTags(_tagData => {
        featuredDropdown.tagHolder.innerHTML = ""
        featuredDropdown.tagArray = []
        _tagData.forEach(item => {
          featuredDropdown.tagArray.push(item.name)
          featuredDropdown.tagHolder.append(
            featuredDropdown.createFromTemplate.tag(
              item.name,
              featuredDropdown.getNumberOfClassesWithThatCategoryOrTag(item.name, false)
            )
          )
        })
      })

      featuredSelected.populateDBArray()
    })
  },
  startFunctions: () => {
    featuredDropdown.populateOptions()

    document.addEventListener("click", e => {
      if (e.target.classList.contains("dropdown-item")) {
        featuredDropdown.selectClickFunction.master(e.target)
      } else if (e.target.closest(".dropdown-item")) {
        featuredDropdown.selectClickFunction.master(e.target.closest(".dropdown-item"))
      }
    })
  },
}
