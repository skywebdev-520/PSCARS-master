'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingsSchema extends Schema {
  up () {
    this.table('bookings', (table) => {
      table.string("uuid").unique()
    })
  }

  down () {
    this.table('bookings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = BookingsSchema
