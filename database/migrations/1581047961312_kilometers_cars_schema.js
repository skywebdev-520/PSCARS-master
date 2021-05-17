'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KilometersCarsSchema extends Schema {
  up () {
    this.create('kilometers_cars', (table) => {
      table.increments()
      table.integer('kilometer_id').unsigned().references('id').inTable('kilometers')
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.timestamps()
    })
  }

  down () {
    this.drop('kilometers_cars')
  }
}

module.exports = KilometersCarsSchema
