const knex = require("../db/connection")

/**
 * List + listDate service for reservation resources
 */
function list() {
  return knex("reservations").select("*")
}

function listDate(date) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_date": date })
}

/**
 * Create service for reservation resources
 * Create returns a list, of which we only need the first element
 */
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0])
}

module.exports = {
  list,
  listDate,
  create,
}
