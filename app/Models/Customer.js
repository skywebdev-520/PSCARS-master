'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {

    orders () {
        return this.hasMany('App/Models/Order')
    }

    receipts () {
        return this.hasMany('App/Models/Receipt')
    }
    driver_front () {
        return this.belongsTo('App/Models/File')
    }
    driver_back () {
        return this.belongsTo('App/Models/File')
    }
    identity_back () {
        return this.belongsTo('App/Models/File')
    }
    identity_back () {
        return this.belongsTo('App/Models/File')
    }
}

module.exports = Customer
