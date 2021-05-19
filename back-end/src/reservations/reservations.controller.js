const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * Validation
 */
async function reservationExists(req, res, next) {
  const reservationsList = await service.read(req.params.reservation_id)
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
  const reservation = { ...req.body }
  if (!reservation.first_name) {
    return next({ status: 400, message: "first_name is required." })
  }
  if (!reservation.last_name) {
    return next({ status: 400, message: "last_name is required." })
  }
  if (!reservation.mobile_number) {
    return next({ status: 400, message: "mobile_number is required." })
  }
  if (!reservation.reservation_date) {
    return next({ status: 400, message: "reservation_date is required." })
  }
  if (!reservation.reservation_time) {
    return next({ status: 400, message: "reservation_time is required." })
  }
  if (!reservation.people) {
    return next({ status: 400, message: "people is required." })
  }
  res.locals.reservation = reservation
  return next()
}
function isTuesday(req, res, next) {
  const reqDate = res.locals.reservation.reservation_date
  const date = new Date(reqDate)
  // console.log("Date: ", date)
  const dateString = date.toDateString()
  // TODO: FIX One day behind
  // console.log("Date string: ", dateString)
  if (dateString.includes("Mon")) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays." })
  }
  return next()
}
function isValidTime(req, res, next) {
  const reqDate = res.locals.reservation.reservation_date
  const reqTime = res.locals.reservation.reservation_time

  // Compare request's getTime to today's using numerical values
  const dateTime = Date.parse(reqDate + " " + reqTime)
  const now = new Date().getTime()
  if (dateTime < now) {
    return next({
      status: 400,
      message: "Reservation date must not be in the past.",
    })
  }

  // Compare request's time to restaurant's hours
  const hours = Number(reqTime.slice(0, 2))
  const minutes = Number(reqTime.slice(3))
  const timeNum = hours * 60 + minutes
  // 630 = 10:30AM 1290 = 9:30PM
  if (timeNum < 630 || timeNum > 1290) {
    return next({
      status: 400,
      message: "Restaurant is closed at the requested time.",
    })
  }

  return next()
}

/**
 * Handlers for reservation resources
 */
async function list(req, res) {
  const date = req.query.date
  const data = date ? await service.listDate(date) : await service.list()
  res.json({ data })
}
async function create(req, res) {
  const reservation = res.locals.reservation
  // console.log(reservation)
  const data = await service.create(reservation)
  res.json({ data })
}
function read(req, res) {
  const data = res.locals.reservation
  res.json({ data })
}
async function update(req, res) {
  const { reservation } = res.locals
  const { status } = req.body.data
  reservation.status = status
  const data = await service.update(reservation, reservation.reservation_id)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(isValidReservation),
    isTuesday,
    isValidTime,
    create,
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), update],
}
