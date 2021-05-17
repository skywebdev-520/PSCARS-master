'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
  up () {
    this.create('customers', (table) => {
      table.increments()
      table.enu("customer_type", ["private", "business"]).defaultTo('private').notNullable()
      table.enu("salutation", ["herr", "frau"]).defaultTo('Herr').notNullable()
      table.string("company")
      table.string("fistname")
      table.string("lastname")
      table.string("street")
      table.string("street_extra")
      table.integer("postcode", 5)
      table.string("city")
      table.string("country", 3)
      table.boolean("isReceiptAdress").defaultTo(true).notNullable()
      table.string("receipt_company")
      table.string("receipt_fistname")
      table.string("receipt_lastname")
      table.string("receipt_street")
      table.string("receipt_street_extra")
      table.integer("receipt_postcode", 5)
      table.string("receipt_city")
      table.string("receipt_country", 3)
      table.date("birthdate")
      table.string("VAT")
      table.string("birthcity")
      table.string("HRB")
      table.integer("phone")
      table.integer("mobile")
      table.integer("fax")
      table.string("email")
      table.string("driver_number")
      table.string("driver_class")
      table.date("driver_printed")
      table.string("driver_goverment")
      table.integer('driver_front').unsigned().references('id').inTable('files')
      table.integer('driver_back').unsigned().references('id').inTable('files')
      table.string("identity_number")
      table.date("identity_outdated")
      table.date("identity_printed")
      table.string("identity_goverment")
      table.enu("identity_type",["old","new","travel","idcard"])      
      table.integer('identity_front').unsigned().references('id').inTable('files')
      table.integer('identity_back').unsigned().references('id').inTable('files')
      table.string("bank")
      table.string("iban")
      table.string("bic")
      table.timestamps()
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = CustomerSchema
