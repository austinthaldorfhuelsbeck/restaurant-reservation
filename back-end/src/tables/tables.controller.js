const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const { destroy } = require("../db/connection")

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
function isAvailable(req, res, next) {
  const { table } = res.locals
  if (table.reservation_id === null) {
    return next()
  }
  next({ status: 400, message: "Table is already occupied." })
}
function isUnavailable(req, res, next) {
  const { table } = res.locals
  if (table.reservation_id !== null) {
    return next()
  }
  next({ status: 400, message: "Table is already available." })
}
async function isLargeEnough(req, res, next) {
  const { table } = res.locals
  const id = req.body.data.reservation_id
  const reservation = await reservationService.read(id)
  if (reservation[0].people < table.capacity) {
    return next()
  }
  next({ status: 400, message: "Table is not large enough for party size." })
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
async function updateTableAssignment(req, res) {
  const { table } = res.locals
  const { reservation_id } = req.body.data
  table.reservation_id = reservation_id
  const data = await service.update(table, table.table_id)
  res.json({ data })
}
async function destroyTableAssignment(req, res) {
  const { table } = res.locals
  table.reservation_id = null
  const data = await service.update(table, table.table_id)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(isValidTable), create],
  read: [asyncErrorBoundary(tableExists), read],
  update: [
    asyncErrorBoundary(tableExists),
    isAvailable,
    isLargeEnough,
    updateTableAssignment,
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isUnavailable,
    destroyTableAssignment,
  ],
}
