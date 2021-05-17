'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingsSchema extends Schema {
  up () {
    this.create('bookings', (table) => {
      table.increments()
      table.date("checkout")
      table.date("checkin")
      table.string("rangeType")
      table.boolean("agb")
      table.boolean("rent")
      table.boolean("dsvgo")
      table.boolean("newsletter")
      table.string("paymentType")
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.string("customer_type")
      table.string("customer_vat")
      table.string("customer_firstname")
      table.string("customer_lastname")
      table.string("customer_address")
      table.string("customer_postcode")
      table.string("customer_city")
      table.string("customer_email")
      table.string("customer_phone") 
      table.integer('coupon_id').unsigned().references('id').inTable('coupons')
      table.string("coupon_description")
      table.string("coupon_type")
      table.string("coupon_value")
      table.integer('kilometer_id').unsigned().references('id').inTable('kilometers')
      table.string("status")
      table.boolean("isPaid").defaultTo(false)
      table.boolean("isDelivered").defaultTo(false)
      table.boolean("isReturned").defaultTo(false)
      table.boolean("isSigned").defaultTo(false)
      table.boolean("isHalfPaid").defaultTo(false)
      table.string("transaction")
      table.string("receipt_link")
      table.string("contract_link")
      table.text("signature")
      table.timestamps()
    })
  }

  down () {
    this.drop('bookings')
  }
}

module.exports = BookingsSchema
