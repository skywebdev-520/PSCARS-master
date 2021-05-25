'use strict'

const Car = use('App/Models/Car')
const Feature = use('App/Models/Feature')
const Kilometer = use('App/Models/Kilometer')
const File = use('App/Models/File')
const Booking = use('App/Models/Booking')
const moment = use('moment')
const Helpers = use('Helpers')
const Damage = use('App/Models/Damage')
const DamageEntry = use('App/Models/DamageEntry')
const { tr } = require('date-fns/locale')
const uuidv1 = require('uuid/v1');

class DamageController {

    async getDmgsByBooking({params}){
        let book = await Booking.query().where("id",params.id).with("car").with("car.damages").with("car.damages.entries").first()
        return book.toJSON().car.damages
    }

    async index({view}){
        const dmgs = await Damage.query().with("car").with("entries").fetch()
        return view.render('Pages/Admin/Damages/index',{dmgs:dmgs.toJSON(),moment})
    }
    async createView({view}) {
        const cars = await Car.all()
        return view.render('Pages/Admin/Damages/new',{cars:cars.toJSON()})
    }
    async create({response, request}){
        const body = request.all()
        let dmg = new Damage()
        dmg.title = body.title
        dmg.timestamp_created = moment(body.timestamp_created,"DD.MM.YYYY").format("YYYY-MM-DD")
        dmg.timestamp_damage = moment(body.timestamp_damage,"DD.MM.YYYY").format("YYYY-MM-DD")
        dmg.damage_type = body.damage_type
        dmg.customer = body.customer
        dmg.order_id = body.order_id
        dmg.name = body.name
        dmg.car_id = body.car_id
        dmg.address = body.address
        dmg.description = body.description
        dmg.accident_creator = body.accident_creator
        await dmg.save()
        return response.redirect("/admin/damages/view/"+dmg.id)
    }
    async update({response, request, params}){
        const body = request.all()
        let dmg = await Damage.findOrFail(params.id)
        dmg.title = body.title
        dmg.timestamp_created = moment(body.timestamp_created,"DD.MM.YYYY").format("YYYY-MM-DD")
        dmg.timestamp_damage = moment(body.timestamp_damage,"DD.MM.YYYY").format("YYYY-MM-DD")
        dmg.damage_type = body.damage_type
        dmg.customer = body.customer
        dmg.order_id = body.order_id
        dmg.name = body.name
        dmg.address = body.address
        dmg.description = body.description
        dmg.car_id = body.car_id
        dmg.accident_creator = body.accident_creator
        await dmg.save()
        return response.redirect("/admin/damages/view/"+dmg.id)
    }
    async view({view,params}){
        const dmg = await Damage.findOrFail(params.id)
        const cars = await Car.all()
        return view.render('Pages/Admin/Damages/view',{moment,cars:cars.toJSON(),dmg:dmg.toJSON()})
    }
    async images({view,params}){
        const dmg = await Damage.findOrFail(params.id)
        await dmg.load("entries")
        return view.render('Pages/Admin/Damages/images',{moment,dmg:dmg.toJSON()})
    }
    async addImages({request,params}){
        let body = request.all()
        let dmgEntry = new DamageEntry()
        const dmg = await Damage.findOrFail(params.id)
        const count = body.length;        
        let imagePath = "";
        for (let i = 0; i < count; i ++) {
            const newImg = request.file('files[' + i +']', {
                types: ['image'],
                size: '20mb'
            })            
            let imgPath = ""
            if(newImg){
                imgPath = uuidv1()+"."+newImg.extname
                let moved = await newImg.move(Helpers.publicPath('uploads'), {
                    name:imgPath,
                    overwrite: true
                })
                if (!newImg.moved()) {
                    return newImg.error()
                }
            }            
            imagePath = imagePath + (i < count && i > 0 ? ',' : '') + imgPath            
        }
        dmgEntry.image = imagePath
        dmgEntry.damage_id = params.id
        dmgEntry.description = body.description
        dmgEntry.mark = body.mark
        dmgEntry.type = body.type
        await dmgEntry.save()
        return true;
    }

    async addBookingImages({request,params}){
        const book = await Booking.findOrFail(params.id)
        let dmg = await Damage.query().where("order_id",book.id).first()
        if(!dmg){
            dmg = new Damage()
            dmg.title = "BUCHUNG "+book.id
            dmg.timestamp_created = moment().format("YYYY-MM-DD")
            dmg.timestamp_damage = moment().format("YYYY-MM-DD")
            dmg.damage_type = "Sonstiges"
            dmg.customer = book.customer_firstname+" "+book.customer_lastname
            dmg.order_id = book.id
            dmg.name = ""
            dmg.car_id = book.car_id
            dmg.address = ""
            dmg.description = "Aufgenommen beim Rückgabe Protokoll"
            dmg.accident_creator = ""
            await dmg.save()
        }
        const newImg = request.file('file', {
            types: ['image'],
            size: '20mb'
        })
        let imgPath = ""
        if(newImg){
            imgPath = uuidv1()+"."+newImg.extname
            let moved = await newImg.move(Helpers.publicPath('uploads'), {
                name:imgPath,
                overwrite: true
            })
            if (!newImg.moved()) {
                return newImg.error()
            }
        }
        let body = request.all()
        let dmgEntry = new DamageEntry()
        dmgEntry.damage_id = dmg.id
        dmgEntry.description = body.description
        dmgEntry.mark = body.mark
        dmgEntry.type = body.type
        dmgEntry.image = imgPath
        await dmgEntry.save()
        return true;
    }
    async delImages({params,response}){
        const dmg = await DamageEntry.findOrFail(params.id)
        await dmg.delete()
        response.redirect("back")
    }
}

module.exports = DamageController
