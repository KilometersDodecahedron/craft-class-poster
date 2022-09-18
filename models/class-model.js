const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PhotoSchema = new Schema({
  src: String,
  alt: String,
})

const classSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  whatsIncluded: String,
  whatDoParticipantsNeedToBring: String,
  duration: {
    string: String,
    num: Number,
  },
  disclaimer: String,
  // label will be something else
  difficulty: {
    type: String,
    required: true,
  },
  availability: {
    virtual: Boolean,
    virtualNoKit: Boolean,
    inPerson: Boolean,
  },
  allowedLocations: {
    virtualOnly: Boolean,
    boutique: Boolean,
    montclairWomanClub: Boolean,
    customVenue: Boolean,
  },
  price: {
    priceForSearchFunction: {
      lowRange: Number,
      highRange: Number,
    },
    multiplePrices: {
      virtual: {
        available: Boolean,
        price: String,
      },
      virtualNoKit: {
        available: Boolean,
        price: String,
      },
      inPerson: {
        available: Boolean,
        price: String,
      },
      addOn: {
        available: Boolean,
        price: String,
      },
    },
  },
  minimumParticipants: {
    hasMinimum: Boolean,
    minimum: Number,
  },
  ageGroup: {
    adult: Boolean,
    child: Boolean,
    mixed: Boolean,
  },
  photos: [PhotoSchema],
  video: {
    hasVideo: Boolean,
    link: String,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  numberOfInquiriesSent: Number,
  featured: {
    type: Boolean,
    default: false,
  },
  dateCreated: { type: Date },
  dateLastUpdated: { type: Date, default: Date.now },
})

const CraftClass = mongoose.model("CraftClass", classSchema)

module.exports = CraftClass
