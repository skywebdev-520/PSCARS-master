'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReceiptsSchema extends Schema {
  up () {
    this.create('receipts', (table) => {
      table.increments()
      table.integer('customer_id').unsigned().references('id').inTable('customers')
      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.text("features")
      table.float("total")
      table.string("coupon_type")
      table.float("coupon_value")
      table.string("coupon_description")
      table.string("payment_type")
      table.boolean("isPayed")
      table.boolean("hasCoupon")
      table.string("link").unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('receipts')
  }
}

module.exports = ReceiptsSchema
