const router = require("express").Router()
const controller = require("./tables.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

/**
 * Defines the router for table & seat resources
 *
 * @type {Router}
 */
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed)
router.route("/:table_id").get(controller.read).all(methodNotAllowed)
router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed)

module.exports = router
