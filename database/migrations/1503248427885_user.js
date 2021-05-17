'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      //table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      //table.string('points').notNullable().defaultTo(0)
      table.string('login_source', 60).notNullable()
      table.string('account_status', 60).notNullable()
      table.string('token')
      //table.string('avatar').notNullable().defaultTo("/assets/img/default-user.jpg")
      //table.string('reflink').unique()
      //table.bool("isNewsletter").defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
