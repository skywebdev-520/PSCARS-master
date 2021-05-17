'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('receipt_id').unsigned()
      table.integer('customer_id').unsigned().references('id').inTable('customers')
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.date("checkin")
      table.date("checkout")
      table.string("checkinTime")
      table.string("checkoutTime")
      table.integer("kilometers")
      table.integer("kilometers_end")
      table.text("extra_informations")
      table.string("payment_type")
      table.string("transaction_id")
      table.string("coupon_type")
      table.float("coupon_value")
      table.string("coupon_description")
      table.float("price")
      table.text("features")

      table.enu("status",["waitingfordeposit","canceled","signed","approved","returned"])
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
