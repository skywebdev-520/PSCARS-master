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
        var turnover;
        
        var total1;
        var total;
        carIds.forEach(async (element) => {
          //  count[element.id] = await Database.select('*').from('bookings').COUNT(car_id).WHERE('car_id', element.id)          
            //turnover = await Database.select(`SUM(price_total) as a`).from('bookings').where('car_id', element.id)
            //turnover = await Database.table('bookings').sum('price_total as total').where('car_id', element.id)
            //const turnover = await Booking.query().with('price_total', (builder) => {
            //    builder.select(Database.raw('sum(ifnull(price_total,0)) as estimate')).select('car_id')}).where({ car_id: element.id }).fetch()
            turnover = await Database.from('bookings').where('car_id', element.id).getSum('price_total')
            //turnover = await Database.raw('select sum(ifnull(price_total,0)) as ttt from bookings where car_id ='+ element.id)
            //console.log('select sum(ifnull(price_total,0)) from bookings where car_id ='+ element.id)
            //let scriptCount = await Database.table('bookings').where('car_id', element.id).count()

            let res = await Database.select('id').from("bookings").where('car_id', element.id)
            //total1 = await Database.select('price_total').from("bookings").where('car_id', element.id)
           // total += total1
            count.push(res.length)            
            //console.log("------------", count)
        });
//        console.log("++++++++++++", await Database.select().COUNT('car_id').from('bookings').WHERE('car_id', 1));
        
        const cars = await Car.query().with("bookings",(builder) => {
            builder.where("checkout", ">", moment().format("YYYY-MM-DD")).where("status","NOT LIKE","STORNIERT")
        }).fetch()                
        console.log("+++++++++++++", turnover)
        return view.render('Pages/Admin/Statistics/index',{ moment,cars: cars.toJSON(), counts: count })
    }
    
}

module.exports = StatisticsController
