const mongoose = require("mongoose")
const Schema = mongoose.Schema

const mediaSliderSchema = new Schema({
  type: {
    type: String,
    enum: ["category", "tag", "other"],
  },
  // this will change depending on the "type"
  //   for "category" and "tag", this will hold the associated data
  //   for "other", this will only tell it what data to display, and the param will be in "secondaryData"
  mainData: {},
  secondaryData: {},
  displayNumber: {
    type: Number,
    required: true,
  },
  randomizeOrder: {
    type: Boolean,
    default: false,
  },
})

const MediaSlider = mongoose.model("MediaSlider", mediaSliderSchema)

module.exports = MediaSlider
