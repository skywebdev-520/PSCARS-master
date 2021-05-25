'use strict'

const Car = use('App/Models/Car')
const Feature = use('App/Models/Feature')
const Kilometer = use('App/Models/Kilometer')
const File = use('App/Models/File')
const Helpers = use('Helpers')
const moment = use('moment')
const Booking = use("App/Models/Booking")
const Database = use('Database')

class StatisticsController {
    async index({ view }) {                
        const carIds = await Database.select('id').from('cars')        
        var count = [];                
        var total = [];
        carIds.forEach(async (element) => {
            const turnover = await Booking.query().where('car_id',element.id).getSum('price_total')
            let res = await Database.select('id').from("bookings").where('car_id', element.id)            
            count.push(res.length)
            if(turnover){
                total.push(turnover.toFixed(2))            
            }else{
                total.push(0)
            }            
        });        
        const cars = await Car.query().with("bookings",(builder) => {
            builder.where("checkout", ">", moment().format("YYYY-MM-DD")).where("status","NOT LIKE","STORNIERT")
        }).fetch()                            
        return view.render('Pages/Admin/Statistics/index',{ moment,cars: cars.toJSON(), counts: count, totals:total })
    }
    
}

module.exports = StatisticsController
