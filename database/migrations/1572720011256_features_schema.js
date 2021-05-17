'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeaturesSchema extends Schema {
  up () {
    this.create('features', (table) => {
      table.increments()
      table.string("title")
      table.float("price")
      table.timestamps()
    })
  }

  down () {
    this.drop('features')
  }
}

module.exports = FeaturesSchema
