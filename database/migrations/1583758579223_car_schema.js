'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarSchema extends Schema {
  up () {
    this.table('cars', (table) => {
      table.integer("inclKilometers_day")
      table.integer("inclKilometers_weekend")
    })
  }

  down () {
    this.table('cars', (table) => {
      // reverse alternations
    })
  }
}

module.exports = CarSchema
