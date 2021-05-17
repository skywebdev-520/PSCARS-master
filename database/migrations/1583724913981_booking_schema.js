'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingSchema extends Schema {
  up () {
    this.table('bookings', (table) => {
      table.string("license_class")
      table.string("license_date")
      table.string("perso_front_file")
      table.string("perso_back_file")
      table.string("license_front_file")
      table.string("license_back_file")
      table.string("perso_2_front_file")
      table.string("perso_2_back_file")
      table.string("license_2_front_file")
      table.string("license_2_back_file")
    })
  }

  down () {
    this.table('bookings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = BookingSchema
