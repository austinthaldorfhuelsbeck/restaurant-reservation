const knex = require("../db/connection")

/**
 * List + create service for table & seat resources
 * Create returns a list, of which we only need the first element
 */
function list() {
  return knex("tables").select("*")
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTables) => createdTables[0])
}

module.exports = {
  list,
  create,
}
