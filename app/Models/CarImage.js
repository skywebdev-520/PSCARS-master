'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CarImage extends Model {
    static get table () {
        return 'images_cars'
    }
}

module.exports = CarImage
