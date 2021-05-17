'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReceiptsEntriesSchema extends Schema {
  up () {
    this.create('receipts_entries', (table) => {
      table.increments()
      table.string("title")
      table.text("description")
      table.integer("amount")
      table.string("amount_desc")
      table.integer('receipt_id').unsigned().references('id').inTable('receipts')
      table.float("single_price")
      table.float("total_price")
      table.timestamps()
    })
  }

  down () {
    this.drop('receipts_entries')
  }
}

module.exports = ReceiptsEntriesSchema
