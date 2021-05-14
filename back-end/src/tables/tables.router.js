const router = require("express").Router()
const controller = require("./tables.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

/**
 * Defines the router for table & seat resources
 *
 * @type {Router}
 */
router.route("/").get(controller.list).all(methodNotAllowed)
router.route("/new").post(controller.create).all(methodNotAllowed)

module.exports = router
