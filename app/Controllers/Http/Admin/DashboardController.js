'use strict'
const Car = use('App/Models/Car')
const Booking = use('App/Models/Booking')
const Damage = use('App/Models/Damage')
const Blocks = use('App/Models/Blocked')
const moment = use('moment')
const Database = use('Database')

class DashboardController {
    async index({view}){
        //const cars = await Car.all()
        const cars = await Car.query().with("bookings",(builder) => {
            builder.where("checkout", ">", moment().format("YYYY-MM-DD")).where("status","NOT LIKE","STORNIERT")
        }).fetch()        
        const books = await Booking.query().where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
        const damages = await Damage.all()
        var counts = cars.toJSON().length               
        var total = []
        var count = []
        for(let i=1; i<=counts; i++){
            const turnover = await Booking.query().where('car_id',i).where("checkout", ">", moment().format("YYYY-MM")).getSum('price_total')
            let res = await Database.select('id').from("bookings").where('car_id', i)            
            count.push(res.length)
            if(turnover){
                total.push(parseInt(turnover.toFixed(2)))            
            }else{
                total.push(0)
            }            
        }            
        let carData = cars.toJSON();                
        let topBookingNumber = Math.max(...count)
        let topBookingCarId = count.indexOf(Math.max(...count)) + 1
        let topBookingCarName = carData[topBookingCarId].title
        let topSaleNumber = Math.max(...total)
        let topSaleCarId = total.indexOf(Math.max(...total)) + 1
        let topSaleCarName = carData[topSaleCarId].title      
        
        return view.render("Pages/Admin/Dashboard/index",{
            cars:cars.toJSON(),
            books:books.toJSON(),
            damages:damages.toJSON(),
            topBookingNumber: topBookingNumber,
            topBookingCarId: topBookingCarId,
            topSaleNumber: topSaleNumber,
            topSaleCarId: topSaleCarId
        })
    }
    async calendar({view}){
        //const books = await Booking.query().where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
        const books = await Booking.query().with("car").where("status","NOT LIKE","STORNIERT").fetch()
        
        let blocked = await Blocks.query().with("car").fetch()
        //const carIds = await Database.select('id').from('blockeds')
        console.log(blocked.toJSON())
        let bkings = books.toJSON().concat(blocked.toJSON())        
        let disabled=[]
        for (let id in bkings) {
            disabled.push(bkings[id])
        }        
        return view.render("Pages/Admin/Calendar/embed",{
            books: disabled.map((el)=>{
                return {
                    id:el.id,
                    title: el.car.title.replace(/<[^>]*>?/gm, ''), 
                    start: el.checkin_time? el.checkin+" "+el.checkin_time+":00":el.checkin+" 09:00",
                    end:   el.checkout_time?el.checkout+" "+el.checkout_time+":00":el.checkout+" 18:00",
                    url: el.checkout_time?"/admin/orders/"+el.id:"/admin/blocks",
                    color:el.checkout_time?"#2253c3":"#f00"
                }
            }),
            JSON
        })
    }
}

module.exports = DashboardController
