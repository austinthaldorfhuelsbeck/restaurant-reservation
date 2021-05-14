const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * Validation
 */
function isValidTable(req, res, next) {
  const table = { ...req.body }
  if (table.table_name.length < 2) {
    return next({
      status: 400,
      message: "Table name must be at least two characters.",
    })
  }
  if (table.capacity < 1) {
    return next({
      status: 400,
      message: "Capacity must be at least one.",
    })
  }
  res.locals.table = table
  return next()
}

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
