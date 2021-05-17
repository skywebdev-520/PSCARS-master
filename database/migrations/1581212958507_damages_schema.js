'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DamagesSchema extends Schema {
  up () {
    this.table('damages', (table) => {
      table.string("title")
      table.date("timestamp_created")
      table.date("timestamp_damage")
      table.string("damage_type")
      table.string("customer")
      table.string("order_id")
      table.string("name")
      table.text("address")
    })
  }

  down () {
    this.table('damages', (table) => {
      // reverse alternations
    })
  }
}

module.exports = DamagesSchema
