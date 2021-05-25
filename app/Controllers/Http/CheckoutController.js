'use strict'
const Car = use('App/Models/Car')
const Coupon = use('App/Models/Coupon')
const Booking = use('App/Models/Booking')
const Blocked = use('App/Models/Blocked')
const Kilometer = use('App/Models/Kilometer')
const Feature = use('App/Models/Feature')
const moment = use('moment')
const slugify = use('slugify')
const stripe = use('stripe')('sk_live_vg9ra69X4zVHbiyOOMVBXvPq00mu2S7kN6')
const { validate } = use('Validator')
const uuidv1 = require('uuid/v1');
const { HttpException } = use('@adonisjs/generic-exceptions') 
const Axios = require('axios');
const Mail = use('Mail')

const axios = Axios.create({
    baseURL: 'https://my.fastbill.com/api/1.0/',
    auth: {
        username: 'info@premium-sport-cars.de',
        password: 'f82dbd21c4d6f0f8df8052a8dfc64b2cydMUAdihPmNbG9zf48vgfvCsPJlRW9US'
    }
});

const curr = require("currency-formatter")

class CheckoutController {
    async index({ params, view }) {

        let car = await Car.findOrFail(params.carid)
        await car.load('images')
        await car.load('features')
        await car.load('mainimg')
        await car.load('kilometers')
        let carJSN = car.toJSON()
        let bookings = await Booking.query().where("car_id",params.carid).select("id","checkout","checkin").where("status","NOT LIKE","ABGESCHLOSSEN").where("status","NOT LIKE","STORNIERT").where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
        let blocked = await Blocked.query().where("car_id",params.carid).select("id","checkout","checkin").where("checkout", ">", moment().format("YYYY-MM-DD")).fetch()
        let bkings = bookings.toJSON().concat(blocked.toJSON())
        let disabled=[]
        for (let id in bkings) {
            disabled.push(bkings[id].checkout)
            disabled.push(bkings[id].checkin)
        }
        var dt = new Date();     
        var weekend;
        if(dt.getDay() == 6 || dt.getDay() == 0){
            weekend = 1;
        }else{
            weekend = 0;
        }  
        return view.render("Pages/checkout", { slugify,disabled:JSON.stringify(disabled),params, car: carJSN, carJSON: JSON.stringify(carJSN), weekend: weekend })
    }
    async coupon({request}) {
        let code = request.input("code", false)
        if (!code) {
            return {status:false}
        } else {
            let coupon = await Coupon.query().select("id",'code', 'description',"type","value").where("code", code).where("valid", ">", moment().format("YYYY-MM-DD")).where("amount", ">", 0).first()
            if (coupon) {
                return {
                    status: true,
                    coupon
                }
            } else {
                return {status:false}
            }
        }

    }
    async thankyou({view,request,response,params}){
        let book = await Booking.query().with("kilometer").with("coupon").with("car").with("car.kilometers").with("car.features").where("uuid",params.orderid).first()
        if(book){
            await Booking.findOrFail(book.id)
        }else{
            await Booking.findOrFail(0)
        }
        let getDays = book.rangeType=="single"?1:moment(book.checkout + " " + book.checkin_time,"YYYY-MM-DD HH:mm").diff(moment(book.checkin + " " + book.checkout_time,"YYYY-MM-DD HH:mm"),"days")
        
        let weekendDays = this.CalculateWeekendDays(moment(book.checkin+' '+book.checkin_time).toDate(),moment(book.checkout+' '+book.checkout_time).toDate())
        let featu = await Feature.query().whereIn("id",JSON.parse(book.features)).fetch()
        if(!book){
            throw new HttpException('Not found', 404)
        }
        if(!book.receipt_send && book.receipt){
            let jON = JSON.parse(book.receipt)

            let dataCust=  await axios.post("api.php",{
                SERVICE:"customer.get",
                FILTER:{TERM:jON.customer.EMAIL}
            })
            if(dataCust.data.RESPONSE.CUSTOMERS.length > 0){
                jON.customer.CUSTOMER_NUMBER = dataCust.data.RESPONSE.CUSTOMERS[0].CUSTOMER_NUMBER
                jON.customer.CUSTOMER_ID = dataCust.data.RESPONSE.CUSTOMERS[0].CUSTOMER_ID
                await axios.post("api.php",{
                    SERVICE:"customer.update",
                    DATA:jON.customer
                })
                jON.receipt.CUSTOMER_ID = dataCust.data.RESPONSE.CUSTOMERS[0].CUSTOMER_ID
            }else{
                let {data}=  await axios.post("api.php",{
                    SERVICE:"customer.create",
                    DATA:jON.customer
                })
                jON.receipt.CUSTOMER_ID = data.RESPONSE.CUSTOMER_ID
            }
            let invD =  await axios.post("api.php",{
                SERVICE:"invoice.create",
                DATA:jON.receipt
            })
            const INVOICE_ID = invD.data.RESPONSE.INVOICE_ID
            await axios.post("api.php",{
                SERVICE:"invoice.complete",
                DATA:{
                    INVOICE_ID
                }
            })
            let res = await axios.post("api.php",{
                SERVICE:"invoice.sendbyemail",
                DATA:{
                    INVOICE_ID,
                    RECIPIENT:{TO: jON.customer.EMAIL}
                }
            })
            book.receipt_send = true
            await book.save()
            await Mail.send('email/notify/booking', {moment,book:book.toJSON()}, (message) => {
                message
                  .to('info@premium-sport-cars.de')
                  .from('info@premium-sport-cars.de')
                  .subject('PSC - Neue Buchung')
            })
        }

        return view.render("Pages/success",{featur:featu.toJSON(),weekendDays,curr,getDays,moment,book:book.toJSON()})
    }
    async verify(request){
        const rules = {
            checkout: 'required|date',
            checkin: 'required|date',
            rangeType: 'required|in:multi,single',
            agbs: 'required|array',
            paymentType: 'required|in:creditcard,banktransfer',
            car: 'required|number',
            customerType: 'required|in:privat,business',
            customerCompany: 'required_when:customerType,business',
            customerFirstname: 'required',
            customerLastname: 'required',
            customerAddress: 'required',
            customerPostcode: 'required',
            customerCity: 'required',
            customerEmail: 'required|email',
        }
        const validation = await validate(request.all(), rules)
        if (validation.fails()) {
            throw new Error("VALIDATION FAILEd")
        }
    }
    async book({request}) {
        const body = request.all()
        await this.verify(request)

        let car = await Car.findOrFail(body.car)

        await car.load('kilometers')
        let kilos = await car.kilometers().fetch()
        if(body.kilometer!=0){
            const kilo =  kilos.toJSON().find(el=>el.id == body.kilometer)
            if(!kilo){
                throw new Error("PACKET NOT FOUND")
            }
        }
        
        await car.load('features')
        const featuz = await car.features().fetch()
        let featuzid = featuz.toJSON().map(el=>el.id)
        for (let id in body.features) {
            if( !featuzid.includes(body.features[id]) ){
                throw new Error("EXTRA NOT FOUND")
            }
        }

        const fullPrice = await this.getFullprice(body,car,featuz)
        let coupon;
        if(body.coupon_id){
            coupon = await Coupon.query().select("id",'code', 'description',"type","value").where("code", body.coupon_code).where("valid", ">", moment().format("YYYY-MM-DD")).where("amount", ">", 0).first()
            
            if(coupon){
                if(coupon.amount == 0 || coupon.type != body.coupon_type || coupon.value != body.coupon_value){
                    throw new Error("COUPON NOT FOUND")    
                }
                coupon.amount = coupon.amount -1
                await coupon.save()
            }else{
                throw new Error("COUPON NOT FOUND")
            }
        }
        await car.load("mainimg")

        car = car.toJSON()
        const uniq = uuidv1()
        let book = new Booking()
        book.uuid = uniq
        book.checkout = body.checkout
        book.checkin = body.checkin
        book.checkin_time = body.timeCheckin
        book.checkout_time = body.timeCheckout
        book.rangeType = body.rangeType
        book.newsletter = body.agbs.includes("newsletter")
        book.paymentType = body.paymentType
        book.car_id = car.id
        book.customer_type = body.customerType
        book.customer_company = body.customerCompany
        book.customer_vat = body.customerVAT
        book.customer_firstname = body.customerFirstname
        book.customer_lastname = body.customerLastname
        book.customer_address = body.customerAddress
        book.customer_postcode = body.customerPostcode
        book.customer_city = body.customerCity
        book.customer_email = body.customerEmail
        book.customer_phone = body.customerPhone
        book.coupon_id = body.coupon_id
        book.coupon_type = body.coupon_type
        book.coupon_value = body.coupon_value
        book.coupon_description = body.coupon_description
        book.features = JSON.stringify(body.features)
        book.kilometer_id = body.kilometer
        book.price_total = fullPrice
        book.price_prepayment = Math.round( (fullPrice/100*car.deposit)*100 ) / 100
        book.status = "UNBEZAHLT"
        book.agb = true
        book.rent = true
        book.dsvgo = true
        book.annotation = body.annotation
        
        if(body.coupon_id){
            let weekendsFull = this.CalculateWeekendDays( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm").toDate(), moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").toDate() ) * car.priceWeekend;
            let weekends = weekendsFull - this.CalculateWeekendDays( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm").toDate(), moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").toDate() ) * car.price;
            let full = weekends + moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").diff( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm"), "days" ) * car.price;
            if(body.rangeType == "single"){
            full = car.priceOneDay
            }
            if(body.coupon_type=="percent"){
            if(body.coupon_value == 100 ){
                book.coupon_price= 0
            }else{
                book.coupon_price= (full /100*body.coupon_value)
            }
            }else{
            book.coupon_price=body.coupon_value;
            }
        }
        const checkinStr = moment(body.checkin+" "+body.timeCheckin).format("DD.MM.YYYY HH:mm")
        const checkoutStr = moment(body.checkout+" "+body.timeCheckout).format("DD.MM.YYYY HH:mm")
        book.receipt = JSON.stringify(this.createBill(body,car,checkinStr,checkoutStr,featuz,kilos,coupon,book) )
        if(body.paymentType == "creditcard"){
            const paymentIntent = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                submit_type: "pay",
                customer_email: body.customerEmail,
                line_items: [{
                    name: car.title.replace(/<[^>]*>?/gm, ''),
                    description: 'Anzahlung für Miete vom '+checkinStr+' Uhr bis '+checkoutStr+' Uhr',
                    images: ['https://buchen.premium-sport-cars.de/uploads/'+car.mainimg.id+'.'+car.mainimg.location],
                    amount: Math.round( (fullPrice/100*car.deposit)*100 ),
                    currency: 'eur',
                    quantity: 1,
                }],
                success_url: 'https://buchen.premium-sport-cars.de/success/'+uniq,
                cancel_url: 'https://buchen.premium-sport-cars.de/buchen/'+car.id,
            });

            book.transaction = paymentIntent.id
            await book.save()
            return paymentIntent
        }else{
            await book.save()
            return 'https://buchen.premium-sport-cars.de/success/'+uniq
        }

        return true
    }
    createBill(body,car,checkinStr,checkoutStr,featz,kilos,coupon,book){
        let customer = {
            CUSTOMER_TYPE: body.customerType=="privat"?"consumer":"business",
            ORGANIZATION: body.customerCompany,
            FIRST_NAME: body.customerFirstname,
            LAST_NAME: body.customerLastname,
            ADDRESS: body.customerAddress,
            ZIPCODE: body.customerPostcode,
            CITY: body.customerCity,
            PHONE: body.customerPhone,
            EMAIL: body.customerEmail,
            VAT_ID: body.customerVAT,
        }
        let receipt = {
            INTROTEXT:'Miete vom '+checkinStr+' Uhr bis '+checkoutStr+' Uhr',
            INVOICE_TITLE:car.title.replace(/<[^>]*>?/gm, ''),
            IS_GROSS:1,
            ITEMS:[
                

            ]
        }
        const weekendDays = this.CalculateWeekendDays( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm").toDate(), moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").toDate() ) 
        const allDaysComplete = moment(body.checkout + " " + body.timeCheckout).diff(moment(body.checkin + " " + body.timeCheckin),"days")
        if(weekendDays>0){
            receipt.ITEMS.push({
                DESCRIPTION:  car.title.replace(/<[^>]*>?/gm, ''),
                QUANTITY:allDaysComplete,
                UNIT: "Tag",
                UNIT_PRICE: ((weekendDays*car.priceWeekend) + ((allDaysComplete-weekendDays)*car.price)) / allDaysComplete, // car.priceWeekend-car.price,
                VAT_PERCENT: 19
            })
        }else{
            receipt.ITEMS.push({
                DESCRIPTION: car.title.replace(/<[^>]*>?/gm, ''),
                QUANTITY: body.rangeType=="single"?1:moment(body.checkout + " " + body.timeCheckout).diff(
                    moment(body.checkin + " " + body.timeCheckin),
                    "days"
                ),
                UNIT: body.rangeType=="single"?"Tag":"Tag",
                UNIT_PRICE: body.rangeType=="single"?car.priceOneDay:car.price,
                VAT_PERCENT: 19
            })
        }

        if(coupon){
            receipt.ITEMS.push({
                DESCRIPTION: "Gutschein "+coupon.description,
                QUANTITY: 1,
                UNIT: "Stück",
                UNIT_PRICE: book.coupon_price* -1,
                VAT_PERCENT: 19
            })
        }
        let fets = featz.toJSON()
        for (let id in fets) {
            if (body.features.includes(fets[id].id)) { 
                if(fets[id].perday){
                    receipt.ITEMS.push({
                        DESCRIPTION: fets[id].title,
                        QUANTITY:moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").diff( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm"), "days" ),
                        UNIT: "Tag",
                        UNIT_PRICE: fets[id].price,
                        VAT_PERCENT: 19
                    })
                }else{
                    receipt.ITEMS.push({
                        DESCRIPTION: fets[id].title,
                        QUANTITY:1,
                        UNIT: "Stück",
                        UNIT_PRICE: fets[id].price,
                        VAT_PERCENT: 19
                    })
                }
            }
        }
        if(body.kilometer!=0){
            const kilo = kilos.toJSON().find(el=>el.id == body.kilometer)
            receipt.ITEMS.push({
                DESCRIPTION: "Zusätzliches Kilometerpaket: "+kilo.kilometers,
                QUANTITY:1,
                UNIT: "Stück",
                UNIT_PRICE: kilo.price,
                VAT_PERCENT: 19
            })
        }
        return {
            receipt,
            customer
        }
        
    }
    CalculateWeekendDays(fromDate, toDate) {
        var weekendDayCount = 0;
        while (fromDate < toDate) {
          if (fromDate.getDay() === 0 || fromDate.getDay() == 6|| fromDate.getDay() == 5) {
            ++weekendDayCount;
          }
          fromDate.setDate(fromDate.getDate() + 1);
        }
        return weekendDayCount;
    }
    async getFullprice(body,car,featz,withoutGift,gift) {
        let days = 1
        if(body.rangeType=="multi"){
          body.timeCheckout = body.timeCheckin
          days = moment(body.checkout + " " + body.timeCheckout).diff( moment(body.checkin + " " + body.timeCheckin), "days" )
        }
        let weekendsFull = this.CalculateWeekendDays( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm").toDate(), moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").toDate() ) * car.priceWeekend;
        let weekends = weekendsFull - this.CalculateWeekendDays( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm").toDate(), moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").toDate() ) * car.price;
        let full = weekends + moment(body.checkout + " " + body.timeCheckout,"YYYY-MM-DD HH:mm").diff( moment(body.checkin + " " + body.timeCheckin,"YYYY-MM-DD HH:mm"), "days" ) * car.price;
        if(body.rangeType == "single"){
          full = car.priceOneDay
        }
        if(!withoutGift){
          if(body.coupon_id){
            if(body.coupon_type=="percent"){
              if(body.coupon_value == 100 ){
                full = 0
              }else{
                full =  full - (full /100*body.coupon_value)
              }
            }else{
                full = full- body.coupon_value;
            }
          }
        }
        let features = featz.toJSON().reduce((total, curr) => {
          if (body.features.includes(curr.id)) { 
            if(curr.perday){
              return total + (curr.price*days);
            }
            return total + curr.price;
          } else { return total; }
        }, 0);
        if(body.kilometer != 0 ){
            const kilo = await Kilometer.findOrFail(body.kilometer)
            features = features + kilo.price
        }
        full = full + features 
          return full ;
    }
}

module.exports = CheckoutController
