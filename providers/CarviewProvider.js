'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const View = use('View')
const Car = use('App/Models/Car')

class CarviewProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    
  }
}

module.exports = CarviewProvider
