'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarsSchema extends Schema {
  up () {
    this.table('cars', (table) => {
      table.integer("inclKilometers").defaultTo(0)
    })
  }

  down () {
    this.table('cars', (table) => {
      // reverse alternations
    })
  }
}

module.exports = CarsSchema
