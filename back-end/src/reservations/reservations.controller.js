const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * Defines the controller for reservation resources
 * Includes validation for existing and new reservations
 * Includes list, create, read, update methods as well as a method to update status only
 * but does not include delete
 *
 * @type {Router}
 */

// VALIDATION
async function reservationExists(req, res, next) {
  let id = ""
  if (req.params.reservation_id) {
    id = req.params.reservation_id
  } else {
    id = req.body.data.reservation_id
  }
  const reservationsList = await service.read(id)
  const reservation = reservationsList[0]
  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} cannot be found.`,
  })
}
function isValidReservation(req, res, next) {
  const reservation = { ...req.body.data }
  //reservation.people = Number(reservation.people)
  let message = ""

  // form is filled in
  if (!reservation.first_name) message += "first_name is required. "
  if (!reservation.last_name) message += "last_name is required. "
  if (!reservation.mobile_number) message += "mobile_number is required. "
  if (
    !reservation.reservation_date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(reservation.reservation_date)
  )
    message += "reservation_date is required. "
  if (
    !reservation.reservation_time ||
    !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(reservation.reservation_time)
  )
    message += "reservation_time is required. "
  if (!reservation.people || typeof reservation.people != "number")
    message += "people is required. "

  // time is valid
  const reqDate = reservation.reservation_date
  const reqTime = reservation.reservation_time
  if (reqDate && reqTime) {
    // Compare request's getTime to today's using numerical values
    const dateTime = Date.parse(reqDate + " " + reqTime)
    const now = new Date().getTime()
    if (dateTime < now) message += "Reservation date must be in the future. "
    // Compare request's time to restaurant's hours
    const hours = Number(reqTime.slice(0, 2))
    const minutes = Number(reqTime.slice(3))
    const timeNum = hours * 60 + minutes
    // 630 = 10:30AM 1290 = 9:30PM
    if (timeNum < 630 || timeNum > 1290) {
      message += "Restaurant is closed at the requested time. "
    }
  }

  // date isn't tuesday
  const date = new Date(reqDate)
  const dateString = date.toDateString()
  if (dateString.includes("Mon")) {
    message += "Restaurant is closed on Tuesdays. "
  }

  // returns error or sets res.locals
  if (message !== "") {
    return next({ status: 400, message })
  }
  res.locals.reservation = reservation
  return next()
}
function isValidStatus(req, res, next) {
  const status = req.body.data.status
  if (
    status === "booked" ||
    status === "seated" ||
    status === "cancelled" ||
    status === "finished"
  ) {
    res.locals.status = status
    return next()
  }

  return next({
    status: 400,
    message: "status is unknown. ",
  })
}
function isStatusBooked(req, res, next) {
  const status = req.body.data.status
  if (status === "booked") return next()
  return next({
    status: 400,
    message:
      "invalid status for a new reservation (seated and finished are invalid). ",
  })
}
function reservationIsSeated(req, res, next) {
  if (res.locals.reservation.status !== "finished") return next()
  return next({
    status: 400,
    message: "reservation already finished. ",
  })
}
function canBeUpdated(req, res, next) {
  if (res.locals.status !== "finished") return next()
  return next({
    status: 400,
    message: "a finished reservation cannot be updated. ",
  })
}
async function isCurrentlyFinished(req, res, next) {
  const status = await service.read(res.locals.reservation.reservation_id)
  if (status !== "finished") return next()
  return next({
    status: 400,
    message: "reservation is",
  })
}

/**
 * Handlers for reservation resources
 */
async function list(req, res) {
  const date = req.query.date
  const mobile_number = req.query.mobile_number
  let data = []
  if (mobile_number) {
    data = await service.search(mobile_number)
  } else if (date) {
    data = await service.listDate(date)
  } else {
    data = await service.list()
  }
  res.json({ data })
}
async function create(req, res) {
  const data = await service.create(res.locals.reservation)
  res.status(201).json({ data })
}
function read(req, res) {
  const data = res.locals.reservation
  res.json({ data })
}
async function update(req, res) {
  const data = await service.update(
    res.locals.reservation,
    res.locals.reservation.reservation_id
  )
  res.json({ data: data[0] })
}
async function updateStatus(req, res) {
  const { reservation } = res.locals
  reservation.status = res.locals.status
  const data = await service.update(
    res.locals.reservation,
    res.locals.reservation.reservation_id
  )
  res.json({ data: data[0] })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [isValidReservation, isStatusBooked, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    isValidReservation,
    canBeUpdated,
    update,
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    reservationIsSeated,
    isCurrentlyFinished,
    isValidStatus,
    updateStatus,
  ],
}
