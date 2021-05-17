'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KilometersSchema extends Schema {
  up () {
    this.create('kilometers', (table) => {
      table.increments()
      table.integer("kilometers")
      table.float("price")
      table.timestamps()
    })
  }

  down () {
    this.drop('kilometers')
  }
}

module.exports = KilometersSchema
