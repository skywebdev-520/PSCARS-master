'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Car extends Model {
    features () {
        return this.belongsToMany('App/Models/Feature')
        .pivotModel('App/Models/CarFeature')
    }
    files () {
        return this.belongsToMany('App/Models/File')
        .pivotModel('App/Models/CarFile')
    }
    mainimg () {
        return this.belongsTo('App/Models/File',"main_img")
    }
    images () {
        return this.belongsToMany('App/Models/File')
        .pivotModel('App/Models/CarImage')
    }
    orders () {
        return this.hasMany('App/Models/Order')
    }
    bookings () {
        return this.hasMany('App/Models/Booking')
    }
    damages () {
        return this.hasMany('App/Models/Damage')
    }
    kilometers () {
        return this.hasMany('App/Models/Kilometer')
    }
}

module.exports = Car
