'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Receipt extends Model {
    customer () {
        return this.belongsTo('App/Models/Customer')
    }
    entries () {
        return this.hasMany('App/Models/ReceiptEntry')
    }
}

module.exports = Receipt
