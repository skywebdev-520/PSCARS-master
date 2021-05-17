'use strict'
const Car = use('App/Models/Car')
const Booking = use('App/Models/Booking')
const Damage = use('App/Models/Damage')
const Blocks = use('App/Models/Blocked')
const moment = use('moment')

class DashboardController {
    async index({view}){
        const cars = await Car.all()
        const books = await Booking.query().where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
        const damages = await Damage.all()
        return view.render("Pages/Admin/Dashboard/index",{
            cars:cars.toJSON(),
            books:books.toJSON(),
            damages:damages.toJSON(),
        })
    }
    async calendar({view}){
        //const books = await Booking.query().where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
        const books = await Booking.query().with("car").where("status","NOT LIKE","STORNIERT").fetch()
        
        let blocked = await Blocks.query().with("car").where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
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
