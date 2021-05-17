'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DamagesSchema extends Schema {
  up () {
    this.table('damages', (table) => {
      table.string("accident_creator")
    })
  }

  down () {
    this.table('damages', (table) => {
      // reverse alternations
    })
  }
}

module.exports = DamagesSchema
