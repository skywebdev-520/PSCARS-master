'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderPaymentsSchema extends Schema {
  up () {
    this.create('order_payments', (table) => {
      table.increments()
      table.string("type")
      table.string("transaction_id")
      table.float('value')
      table.integer("order_id").unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('order_payments')
  }
}

module.exports = OrderPaymentsSchema
