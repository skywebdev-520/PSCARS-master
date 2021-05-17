'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FilesOrdersSchema extends Schema {
  up () {
    this.create('files_orders', (table) => {
      table.increments()
      table.integer('file_id').unsigned().references('id').inTable('files')
      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.timestamps()
    })
  }

  down () {
    this.drop('files_orders')
  }
}

module.exports = FilesOrdersSchema
