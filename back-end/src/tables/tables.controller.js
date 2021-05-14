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
async function tableExists(req, res, next) {
  const tableList = await service.read(req.params.table_id)
  const table = tableList[0]
  if (table) {
    res.locals.table = table
    console.log("Table exists!")
    return next()
  }
  next({ status: 404, message: "Table cannot be found." })
}

/**
 * Handlers for table & seat resources
 */
async function list(req, res) {
  const data = await service.list()
  res.json({ data })
}
async function create(req, res) {
  const { table } = res.locals
  const data = await service.create(table)
  res.json({ data })
}
function read(req, res) {
  const { table } = res.locals
  res.json({ data: table })
}
async function update(req, res) {
  const { table } = res.locals
  const { reservation_id } = req.body.data
  const updatedTable = { ...table, ...reservation_id }
  const id = table.table_id
  const data = await service.update(updatedTable, id)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(isValidTable), create],
  read,
  update: [asyncErrorBoundary(tableExists), update],
}
