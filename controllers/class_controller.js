// tells it how to structure
const db = require("../models")
const express = require("express")
const router = express.Router()

module.exports = {
  getAllClasses: function (req, res) {
    db.CraftClass.find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  postClass: function (req, res) {
    db.CraftClass.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  updateClass: function (req, res) {
    db.CraftClass.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  updateClassTag: function (req, res) {
    db.CraftClass.updateMany(
      {},
      { $set: { "tags.$[element]": req.body.newName } },
      { arrayFilters: [{ element: req.body.oldName }] }
    )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  updateClassCategory: function (req, res) {
    db.CraftClass.updateMany({ category: req.body.oldName }, { category: req.body.newName })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  deleteClass: function (req, res) {
    db.CraftClass.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
}
