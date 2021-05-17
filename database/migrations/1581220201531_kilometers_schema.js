'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KilometersSchema extends Schema {
  up () {
    this.table('kilometers', (table) => {
      table.string("description")
    })
  }

  down () {
    this.table('kilometers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = KilometersSchema
