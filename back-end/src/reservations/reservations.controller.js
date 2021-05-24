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
  console.log("reservation", reservation)
  let message = ""

  // form is filled in
  if (!reservation.first_name) message += "first_name is required. "
  if (!reservation.last_name) message += "last_name is required. "
  if (!reservation.mobile_number) message += "mobile_number is required. "
  if (!reservation.reservation_date) message += "reservation_date is required. "
  if (!reservation.reservation_time) message += "reservation_time is required. "
  if (!reservation.people) message += "people is required. "

  // time is valid
  const reqDate = reservation.reservation_date
  const reqTime = reservation.reservation_time
  // Compare request's getTime to today's using numerical values
  const dateTime = Date.parse(reqDate + " " + reqTime)
  const now = new Date().getTime()
  if (dateTime < now) message += "Reservation date must not be in the past. "
  // Compare request's time to restaurant's hours
  const hours = Number(reqTime.slice(0, 2))
  const minutes = Number(reqTime.slice(3))
  const timeNum = hours * 60 + minutes
  // 630 = 10:30AM 1290 = 9:30PM
  if (timeNum < 630 || timeNum > 1290) {
    message += "Restaurant is closed at the requested time. "
  }

  // date isn't tuesday
  const date = new Date(reqDate)
  const dateString = date.toDateString()
  if (dateString.includes("Mon")) {
    message += "Restaurant is closed on Tuesdays. "
  }

  // returns error or sets res.locals
  if (message !== "") {
    console.log("message:", message)
    return next({ status: 400, message })
  }
  res.locals.reservation = reservation
  return next()
}

/**
 * Handlers for reservation resources
 */
async function list(req, res) {
  const date = req.query.date
  const mobile_phone = req.query.mobile_phone
  let data = []
  if (!date && !mobile_phone) data = await service.list()
  if (date) data = await service.listDate(date)
  if (mobile_phone) data = await service.search(mobile_phone)
  res.json({ data })
}
async function create(req, res) {
  const data = await service.create(res.locals.reservation)
  res.json({ data })
}
function read(req, res) {
  const data = res.locals.reservation
  res.json({ data })
}
async function update(req, res) {
  console.log("Reservation", res.locals.reservation)
  const data = await service.update(
    res.locals.reservation,
    res.locals.reservation.reservation_id
  )
  res.json({ data })
}
async function updateStatus(req, res) {
  const { reservation } = res.locals
  const { status } = req.body.data
  reservation.status = status
  const data = await service.update(
    res.locals.reservation,
    res.locals.reservation.reservation_id
  )
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [isValidReservation, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), isValidReservation, update],
  updateStatus: [asyncErrorBoundary(reservationExists), updateStatus],
}
