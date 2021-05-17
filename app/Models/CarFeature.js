'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CarFeature extends Model {
    static get table () {
        return 'features_cars'
    }
}

module.exports = CarFeature
