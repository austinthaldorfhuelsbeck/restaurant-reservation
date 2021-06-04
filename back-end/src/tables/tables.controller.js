const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const { destroy } = require("../db/connection")

/**
 * Validation
 */
function isValidTable(req, res, next) {
  const table = { ...req.body.data }
  table.capacity = Number(table.capacity)
  let message = ""
  if (!table.table_name || table.table_name.length < 2)
    message += "table_name must be at least two characters. "
  if (
    !table.capacity ||
    table.capacity < 1 ||
    typeof table.capacity != "number"
  )
    message += "capacity must be at least one. "
  // returns error or sets res.locals
  if (message !== "") {
    return next({ status: 400, message })
  }
  res.locals.table = table
  return next()
}
async function tableExists(req, res, next) {
  const tableList = await service.read(req.params.table_id)
  const table = tableList[0]
  if (table) {
    res.locals.table = table
    return next()
  }
  next({
    status: 404,
    message: `Table ${req.params.table_id} cannot be found.`,
  })
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
  next({ status: 400, message: "Table is not occupied." })
}
async function isLargeEnough(req, res, next) {
  const { table } = res.locals
  if (req.body.data) {
    const id = req.body.data.reservation_id
    if (id) {
      const reservation = await reservationService.read(id)
      if (!reservation[0]) {
        return next({
          status: 404,
          message: `table ${id} not found.`,
        })
      }
      if (reservation[0].people > table.capacity) {
        return next({
          status: 400,
          message: "table capacity is not large enough for party size.",
        })
      }
    } else {
      return next({
        status: 400,
        message: "invalid reservation_id. ",
      })
    }
  } else {
    return next({
      status: 400,
      message: "no data provided.",
    })
  }
  next()
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
  res.status(201).json({ data })
}
function read(req, res) {
  const { table } = res.locals
  res.json({ data: table })
}
async function updateTableAssignment(req, res, next) {
  const { table } = res.locals

  // updates table
  if (req.body.data) table.reservation_id = req.body.data.reservation_id
  const data = await service.update(table, table.table_id)

  // updates reservation
  const reservationList = await reservationService.read(table.reservation_id)
  const reservation = reservationList[0]
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "reservation already seated. ",
    })
  } else {
    reservation.status = "seated"
  }
  await reservationService.update(reservation, reservation.reservation_id)

  res.json({ data })
}
async function destroyTableAssignment(req, res) {
  const { table } = res.locals

  // updates reservation
  const reservationList = await reservationService.read(table.reservation_id)
  if (reservationList[0]) {
    const reservation = reservationList[0]
    reservation.status = "finished"
    await reservationService.update(reservation, reservation.reservation_id)
  }

  // updates table
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
