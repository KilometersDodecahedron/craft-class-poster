const router = require("express").Router()
const categoryController = require("../../controllers/category_controller.js")

router.route("/").get(categoryController.getAllCategories)

router.route("/create").post(categoryController.postCategory)

router.route("/update/:id").put(categoryController.updateCategory)

router.route("/delete/:id").delete(categoryController.deleteCategory)

module.exports = router
