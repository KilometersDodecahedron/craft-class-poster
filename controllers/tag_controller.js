// tells it how to structure
const db = require("../models")
const express = require("express")
const router = express.Router()

module.exports = {
  getTags: function (req, res) {
    db.Tag.find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  postTag: function (req, res) {
    db.Tag.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  updateTag: function (req, res) {
    db.Tag.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  deleteTag: function (req, res) {
    db.Tag.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
}
