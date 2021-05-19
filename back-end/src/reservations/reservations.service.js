const knex = require("../db/connection")

/**
 * List + listDate service for reservation resources
 */
function list() {
  return knex("reservations as r").select("*").orderBy("r.reservation_time")
}

function listDate(date) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_date": date })
}

/**
 * CRUD services for reservation resources
 * Create returns a list, of which we only need the first element
 */
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0])
}
function read(id) {
  return knex("reservations as r").select("*").where({ "r.reservation_id": id })
}
function update(updatedReservation, id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update(updatedReservation, "*")
}

module.exports = {
  list,
  listDate,
  create,
  read,
  update,
}
