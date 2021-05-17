'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
    receipt () {
        return this.belongsTo('App/Models/Receipt')
    }
    customer () {
        return this.belongsTo('App/Models/Customer')
    }
    car () {
        return this.belongsTo('App/Models/Car')
    }
}

module.exports = Order
