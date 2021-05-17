'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponSchema extends Schema {
  up () {
    this.create('coupons', (table) => {
      table.increments()
      table.enu("type", ["percent", "direct"]).notNullable().defaultTo("percent")
      table.string("code").notNullable()
      table.string("description")
      table.float("value")
      table.integer("amount")
      table.date("valid")
      table.timestamps()
    })
  }

  down () {
    this.drop('coupons')
  }
}

module.exports = CouponSchema
