const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * Validation
 */
function isValidTable(req, res, next) {}

/**
 * Handlers for table & seat resources
 */
async function list(req, res) {
  const data = await service.list()
  res.json({ data })
}
async function create(req, res) {
  const reservation = res.locals.table
  const data = await service.create(reservation)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(isValidTable), create],
}
