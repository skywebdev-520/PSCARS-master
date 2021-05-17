'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Damage extends Model {

    car () {
        return this.belongsTo('App/Models/Car')
    }
    entries () {
        return this.hasMany('App/Models/DamageEntry')
    }
}

module.exports = Damage
