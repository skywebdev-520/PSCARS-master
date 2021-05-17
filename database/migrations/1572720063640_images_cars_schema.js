'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagesCarsSchema extends Schema {
  up () {
    this.create('images_cars', (table) => {
      table.increments()
      table.integer('file_id').unsigned().references('id').inTable('files')
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.timestamps()
    })
  }

  down () {
    this.drop('images_cars')
  }
}

module.exports = ImagesCarsSchema
