'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarsSchema extends Schema {
  up () {
    this.table('cars', (table) => {
      table.integer("priceOneDay").defaultTo(0).notNullable()
    })
  }

  down () {
    this.table('cars', (table) => {
      // reverse alternations
    })
  }
}

module.exports = CarsSchema
