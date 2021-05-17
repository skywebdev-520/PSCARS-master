'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarsSchema extends Schema {
  up () {
    this.create('cars', (table) => {
      table.increments()
      table.string("vin")
      table.string("title")
      table.string("plate")
      table.string("letter")
      table.string("insurance")
      table.text("description")
      table.string("location")
      table.string("kilometer")
      table.integer("ccm")
      table.integer("power")
      table.integer("deposit")
      table.integer("price").defaultTo(0).notNullable()
      table.integer("priceWeekend").defaultTo(0).notNullable()
      table.integer("main_img").unsigned()
      table.boolean("published").defaultTo(false).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('cars')
  }
}

module.exports = CarsSchema
