// tells it how to structure
const db = require("../models")
const express = require("express")
const router = express.Router()

module.exports = {
  getAllCategories: function (req, res) {
    db.Category.find(req.query)
      .sort({ name: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  postCategory: function (req, res) {
    db.Category.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  updateCategory: function (req, res) {
    db.Category.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  deleteCategory: function (req, res) {
    db.Category.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
}
