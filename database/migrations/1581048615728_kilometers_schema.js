'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KilometersSchema extends Schema {
  up () {
    this.table('kilometers', (table) => {
      // alter table
      table.integer('car_id').unsigned().references('id').inTable('cars')
    })
  }

  down () {
    this.table('kilometers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = KilometersSchema
