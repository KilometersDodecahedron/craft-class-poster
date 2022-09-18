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

      nameDisplay.innerHTML = _name
      numberDisplay.innerHTML = `(${_number})`

      return newItem
    },
    tag: (_name, _number) => {
      let newItem = featuredDropdown.tagItemTemplate.content.cloneNode(true)
      let nameDisplay = newItem.querySelector(".featured-dropdown--item")
      let numberDisplay = newItem.querySelector(".featured-dropdown--item-number")

      nameDisplay.innerHTML = _name
      numberDisplay.innerHTML = `(${_number})`

      return newItem
    },
  },
  selectClickFunction: {
    master: _target => {
      key = _target.dataset.key
      if (key == "category") {
        featuredDropdown.selectClickFunction.category(_target)
      } else if (key == "tag") {
        featuredDropdown.selectClickFunction.tag(_target)
      } else if (key == "other") {
        featuredDropdown.selectClickFunction.other(_target)
      }
    },
    category: _target => {
      console.log("category")
    },
    tag: _target => {
      console.log("tag")
    },
    other: _target => {
      console.log("other")
    },
  },
  startFunctions: () => {
    getAllClasses(_classData => {
      featuredDropdown.classArray = _classData

      let numberOfFeatured = 0
      featuredDropdown.classArray.forEach(classEntry => {
        if (classEntry.featured) numberOfFeatured++
      })
      document.querySelector(
        "#featured-dropdown--best-sellers-number"
      ).innerHTML = `(${numberOfFeatured})`

      getAllCategories(_categoryData => {
        featuredDropdown.categoryHolder.innerHTML = ""
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
    })

    document.addEventListener("click", e => {
      if (e.target.classList.contains("dropdown-item")) {
        featuredDropdown.selectClickFunction.master(e.target)
      } else if (e.target.closest(".dropdown-item")) {
        featuredDropdown.selectClickFunction.master(e.target.closest(".dropdown-item"))
      }
    })
  },
}
