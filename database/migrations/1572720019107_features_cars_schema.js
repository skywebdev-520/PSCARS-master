'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeaturesCarsSchema extends Schema {
  up () {
    this.create('features_cars', (table) => {
      table.increments()
      table.integer('feature_id').unsigned().references('id').inTable('features')
      table.integer('car_id').unsigned().references('id').inTable('cars')
      table.timestamps()
    })
  }

  down () {
    this.drop('features_cars')
  }
}

module.exports = FeaturesCarsSchema
