const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * Validation
 */
function isValidReservation(req, res, next) {
  const reservation = { ...req.body }
  if (!reservation.first_name) {
    return next({ status: 400, message: "First name is required." })
  }
  if (!reservation.last_name) {
    return next({ status: 400, message: "Last name is required." })
  }
  if (!reservation.mobile_number) {
    return next({ status: 400, message: "Mobile number is required." })
  }
  if (!reservation.reservation_date) {
    return next({ status: 400, message: "Reservation date is required." })
  }
  if (!reservation.reservation_time) {
    return next({ status: 400, message: "Reservation time is required." })
  }
  if (!reservation.people) {
    return next({ status: 400, message: "Party size is required." })
  }
  res.locals.reservation = reservation
  return next()
}
function isTuesday(req, res, next) {
  const reqDate = res.locals.reservation.reservation_date
  const date = new Date(reqDate)
  // console.log("Date: ", date)
  const dateString = date.toDateString()
  // TODO: FIX One day behind for some reason??
  // console.log("Date string: ", dateString)
  if (dateString.includes("Mon")) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays." })
  }
  return next()
}
function isFuture(req, res, next) {
  const reqDate = res.locals.reservation.reservation_date
  // Compare request's getTime to today's
  // Subtracts 24hrs from today result because request will be at 12:00AM
  const date = new Date(reqDate)
  const today = new Date()
  const dateTime = date.getTime()
  const todayTime = today.getTime() - 86400000
  if (dateTime < todayTime) {
    return next({
      status: 400,
      message: "Reservation date must not be in the past.",
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
  console.log(reservation)
  const data = await service.create(reservation)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(isValidReservation), isTuesday, isFuture, create],
}
