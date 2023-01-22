const inputFieldLimiter = {
  limits: {
    className: 200,
    description: 2000,
    whatsIncluded: 2000,
    whatDoParticipantsNeedToBring: 2000,
    disclaimer: 1000,
    // for both high and low ranges
    priceRangeMax: 10000000,
    // for all 4 fields
    priceDescription: 400,
    minimumParticipantsField: 1000000,
  },
  inputs: {
    classNameInput: document.querySelector("#class-name").querySelector("input"),
    description: document.querySelector("#description").querySelector(".ql-editor"),
    whatsIncluded: document
      .querySelector("#description-whats-included")
      .querySelector(".ql-editor"),
    whatDoParticipantsNeedToBring: document
      .querySelector("#description-need-to-bring")
      .querySelector(".ql-editor"),
    disclaimer: document.querySelector("#disclaimer").querySelector("input"),
    priceFields: {
      priceForSearchFunction: {
        lowRange: document.querySelector("#price-sorting--low"),
        highRange: document.querySelector("#price-sorting--high"),
      },
      multiplePrices: {
        virtual: document.querySelector("#price-display--virtual-kit").querySelector("input"),
        virtualNoKit: document
          .querySelector("#price-display--virtual-no-kit")
          .querySelector("input"),
        inPerson: document.querySelector("#price-display--in-person").querySelector("input"),
        addOn: document.querySelector("#price-display--add-on").querySelector("input"),
      },
    },
    minimumParticipantsField: document
      .querySelector("#minimum-paticipants--text")
      .querySelector("input"),
  },
  applyEvents: () => {
    // these are on main.handlebars
    quillDescription.on("text-change", () => {
      if (quillDescription.getLength() > inputFieldLimiter.limits.description) {
        quillDescription.deleteText(
          inputFieldLimiter.limits.description,
          quillDescription.getLength()
        )
      }
    })
    quillWhatsIncluded.on("text-change", () => {
      if (quillWhatsIncluded.getLength() > inputFieldLimiter.limits.whatsIncluded) {
        quillWhatsIncluded.deleteText(
          inputFieldLimiter.limits.whatsIncluded,
          quillWhatsIncluded.getLength()
        )
      }
    })
    quillNeedToBring.on("text-change", () => {
      if (quillNeedToBring.getLength() > inputFieldLimiter.limits.whatDoParticipantsNeedToBring) {
        quillNeedToBring.deleteText(
          inputFieldLimiter.limits.whatDoParticipantsNeedToBring,
          quillNeedToBring.getLength()
        )
      }
    })
  },
  applyLimits: () => {
    inputFieldLimiter.inputs.classNameInput.maxLength = inputFieldLimiter.limits.className
    inputFieldLimiter.inputs.disclaimer.maxLength = inputFieldLimiter.limits.disclaimer
    inputFieldLimiter.inputs.priceFields.priceForSearchFunction.lowRange.min = 0
    inputFieldLimiter.inputs.priceFields.priceForSearchFunction.lowRange.max =
      inputFieldLimiter.limits.priceRangeMax
    inputFieldLimiter.inputs.priceFields.priceForSearchFunction.highRange.min = 0
    inputFieldLimiter.inputs.priceFields.priceForSearchFunction.highRange.max =
      inputFieldLimiter.limits.priceRangeMax
    inputFieldLimiter.inputs.priceFields.multiplePrices.virtual.maxLength =
      inputFieldLimiter.limits.priceDescription
    inputFieldLimiter.inputs.priceFields.multiplePrices.virtualNoKit.maxLength =
      inputFieldLimiter.limits.priceDescription
    inputFieldLimiter.inputs.priceFields.multiplePrices.inPerson.maxLength =
      inputFieldLimiter.limits.priceDescription
    inputFieldLimiter.inputs.priceFields.multiplePrices.addOn.maxLength =
      inputFieldLimiter.limits.priceDescription
    inputFieldLimiter.inputs.minimumParticipantsField.min = 0
    inputFieldLimiter.inputs.minimumParticipantsField.max =
      inputFieldLimiter.limits.minimumParticipantsField
  },
  startFunction: () => {
    inputFieldLimiter.applyLimits()
    inputFieldLimiter.applyEvents()
  },
}
