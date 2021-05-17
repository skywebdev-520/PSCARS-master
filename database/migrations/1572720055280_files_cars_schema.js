'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FilesCarsSchema extends Schema {
  up () {
    this.create('files_cars', (table) => {
      table.increments()
      table.integer('file_id').unsigned().references('id').inTable('files')
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.timestamps()
    })
  }

  down () {
    this.drop('files_cars')
  }
}

module.exports = FilesCarsSchema
