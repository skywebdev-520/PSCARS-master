'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DamagesSchema extends Schema {
  up () {
    this.create('damages', (table) => {
      table.increments()
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.integer('marker').unsigned().references('id').inTable('files')
      table.integer('picture').unsigned().references('id').inTable('files')
      table.text("description")
      table.timestamps()
    })
  }

  down () {
    this.drop('damages')
  }
}

module.exports = DamagesSchema
