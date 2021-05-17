'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DamageEntrySchema extends Schema {
  up () {
    this.drop('damage_entries')

    this.create('damage_entries', (table) => {
      table.increments()
      table.integer('damage_id').unsigned().references('id').inTable('damages')
      table.text("description")
      table.text("mark")
      table.string("type")
      table.string("image")
      table.timestamps()
    })
  }

  down () {
    this.drop('damage_entries')
  }
}

module.exports = DamageEntrySchema
