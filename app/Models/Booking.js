'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Booking extends Model {

    customer () {
        return this.belongsTo('App/Models/Customer')
    }
    car () {
        return this.belongsTo('App/Models/Car')
    }
    kilometer() {
        return this.belongsTo('App/Models/Kilometer')
    }
    coupon() {
        return this.belongsTo('App/Models/Coupon')
    }
}

module.exports = Booking
