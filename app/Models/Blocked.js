'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Blocked extends Model {
    car(){
        return this.belongsTo('App/Models/Car')
    }
}

module.exports = Blocked
