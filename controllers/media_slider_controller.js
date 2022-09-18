// tells it how to structure
const db = require("../models")
const express = require("express")
const router = express.Router()

module.exports = {
  getAllFeatured: function (req, res) {
    db.MediaSlider.find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  postFeatured: function (req, res) {
    db.MediaSlider.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  updateFeatured: function (req, res) {
    db.MediaSlider.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  deleteFeatured: function (req, res) {
    db.MediaSlider.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
}
