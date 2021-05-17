'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { view, request, response }) {
    if (error.status == "500") {
      console.log(error)
      return response.status(error.status).send(view.render('Errors/500',{error}))
    }
    if (error.status == "404") {
      return response.status(error.status).send(view.render('Errors/404',{error}))
    }
    if (error.status == "401") {
      return response.status(error.status).send(view.render('Pages/Admin/login'))
    }
    response.status(error.status).send(error.message)
  }


  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
