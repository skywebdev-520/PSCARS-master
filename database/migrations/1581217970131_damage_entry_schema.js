'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DamageEntrySchema extends Schema {
  up () {
    this.create('damage_entries', (table) => {
      table.increments()
      table.integer('damage_id').unsigned().references('id').inTable('damages')
      table.string("type")
      table.string("position")
      table.string("size")
      table.text("description")
      table.text("marker")
      table.string("marker_bg")
      table.timestamps()
    })
  }

  down () {
    this.drop('damage_entries')
  }
}

module.exports = DamageEntrySchema
