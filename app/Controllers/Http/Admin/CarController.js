'use strict'
const Car = use('App/Models/Car')
const Feature = use('App/Models/Feature')
const Kilometer = use('App/Models/Kilometer')
const File = use('App/Models/File')
const Helpers = use('Helpers')
const moment = use('moment')

class CarController {

    async featuresIndex({ view }) {
        return view.render("Pages/Admin/Cars/features", { features: (await Feature.all()).toJSON() })
    }
    async featuresAdd({ response, request }) {
        const body = request.all()
        let feat = new Feature()
        feat.title = body.title
        feat.price = body.price
        feat.perday = body.perday
        await feat.save()
        return response.redirect('/admin/features')
    }
    async featuresDelete({ response, params}) {
        let feat = await Feature.findOrFail(params.id)
        await feat.delete()
        return response.redirect('/admin/features')
    }

    async kilometerIndex({ view,params }) {
        let car = await Car.findOrFail(params.id)
        const kilometers = await Kilometer.query().where("car_id",params.id).fetch()
        return view.render("Pages/Admin/Cars/edit/kilometers", { car:car.toJSON(),kilometers: kilometers.toJSON() })
    }
    async kilometerAdd({ response, request,params }) {
        const body = request.all()
        let feat = new Kilometer()
        feat.kilometers = body.kilometers
        feat.price = body.price
        feat.car_id = params.id
        feat.description = body.description
        await feat.save()
        return response.redirect('/admin/cars/edit/'+params.id+'/kilometers')
    }
    async kilometerDelete({ response, params}) {
        let feat = await Kilometer.findOrFail(params.fedid)
        await feat.delete()
        return response.redirect('/admin/cars/edit/'+params.id+'/kilometers')
    }

    async adFeatToCar({ response, params }) {
        let car = await Car.findOrFail(params.id)
        let fet = await Feature.findOrFail(params.fetID)
        await car.features().attach([fet.id])
        return response.redirect('/admin/cars/edit/'+params.id+"/features")
    }
    async rmFeatToCar({ response, params }) {
        let car = await Car.findOrFail(params.id)
        let fet = await Feature.findOrFail(params.fetID)
        await car.features().detach([fet.id])
        return response.redirect('/admin/cars/edit/'+params.id+"/features")
    }

    async carFeatures({ view, params }) {
        let car = await Car.findOrFail(params.id)
        let all = await Feature.all()
        let selected = await car.features().fetch()
        let flatmap = selected.toJSON().map((v) => v.id)
        let notSelected = all.toJSON().filter((val) => {
            if (!flatmap.includes(val.id)) {
                return true
            }
            return false
        })
        
        return view.render("Pages/Admin/Cars/edit/features",{selected:selected.toJSON(),car:car.toJSON(),notSelected})
    }

    async index({ view }) {
        const cars = await Car.query().with("bookings",(builder) => {
            builder.where("checkout", ">", moment().format("YYYY-MM-DD")).where("status","NOT LIKE","STORNIERT")
        }).fetch()
        return view.render("Pages/Admin/Cars/index", { moment,cars: cars.toJSON() })
    }
    async single({ view, params }) {
        let car = await Car.findOrFail(params.id)
        let main_img = await File.find(car.main_img)
        return view.render('Pages/Admin/Cars/edit/info', {  car, main_img })
    }
    async damages({ view, params }) {
        let car = await Car.findOrFail(params.id)
        await car.load("damages")
        return view.render('Pages/Admin/Cars/edit/damages', {  car:car.toJSON(), })
    }

    async addImage({request, response,params}) {
        let car = await Car.findOrFail(params.id)
        const newImg = request.file('image', {
            types: ['image'],
            size: '20mb'
        })
        let new_img = null
        new_img = new File()
        new_img.location = newImg.extname
        new_img.mime = newImg.extname
        new_img.default = true
        await new_img.save()
        await newImg.move(Helpers.publicPath('uploads'), {
            name: new_img.id+"."+newImg.extname,
            overwrite: true
        })
        if (!newImg.moved()) {
            return newImg.error()
        }
        await car.images().attach([new_img.id])
        return response.redirect('/admin/cars/edit/'+car.id+"/images")
    }
    async deleteImage({params, response}) {
        let car = await Car.findOrFail(params.id)
        await car.images().detach([params.imgId])
        let file = await File.findOrFail(params.imgId)
        await file.delete()

        return response.redirect('/admin/cars/edit/'+params.id+"/images")
    }

    async images({ view, params }) {
        let car = await Car.findOrFail(params.id)
        let images = await car.images().fetch()
        return view.render('Pages/Admin/Cars/edit/images', { car,images:images.toJSON() })
    }

    async update({ request, response, params }) {
        let newCar = await Car.findOrFail(params.id)
        
        const mainImg = request.file('main_img', {
            types: ['image'],
            size: '20mb'
        })
        let main_img = null
        if (mainImg) {

            main_img = new File()
            main_img.location = mainImg.extname
            main_img.mime = mainImg.extname
            main_img.default = true
            await main_img.save()
            await mainImg.move(Helpers.publicPath('uploads'), {
                name: main_img.id+"."+mainImg.extname,
                overwrite: true
            })
            if (!mainImg.moved()) {
                return mainImg.error()
            }
        }
        const body = request.all()
        newCar.vin = body.vin
        newCar.title = body.title
        newCar.category = body.category
        newCar.type = body.type
        newCar.plate = body.plate
        newCar.kilometer = body.kilometer
        newCar.insurance = body.insurance
        newCar.letter = body.letter
        newCar.ccm = body.ccm
        newCar.power = body.power
        newCar.location = body.location
        newCar.price = body.price
        newCar.priceOneDay = body.priceOneDay
        newCar.priceWeekend = body.priceWeekend
        newCar.deposit = body.deposit
        newCar.description = body.description
        newCar.vmax = body.vmax
        newCar.doors = body.doors
        newCar.prepayment = body.prepayment
        newCar.engine = body.engine
        newCar.petrol = body.petrol
        newCar.passengers = body.passengers
        newCar.age = body.age
        newCar.deductible = body.deductible
        newCar.license = body.license
        newCar.inclKilometers = body.inclKilometers
        newCar.inclKilometers_day = body.inclKilometers_day
        newCar.inclKilometers_weekend = body.inclKilometers_weekend
        newCar.extra_price_km = body.extra_price_km
        if (main_img) {
            newCar.main_img = main_img.id
        }
        newCar.published = body.published
        await newCar.save()
        return response.redirect('/admin/cars/edit/'+newCar.id)
    }
    async add({ request,response }) {
        const mainImg = request.file('main_img', {
            types: ['image'],
            size: '20mb'
        })
        let main_img = null
        if (mainImg) {

            main_img = new File()
            main_img.location = mainImg.extname
            main_img.mime = mainImg.extname
            main_img.default = true
            await main_img.save()
            await mainImg.move(Helpers.publicPath('uploads'), {
                name: main_img.id+"."+mainImg.extname,
                overwrite: true
            })
            if (!mainImg.moved()) {
                return mainImg.error()
            }
        }
        const body = request.all()
        let newCar = new Car
        newCar.vin = body.vin
        newCar.title = body.title
        newCar.category = body.category
        newCar.type = body.type
        newCar.plate = body.plate
        newCar.kilometer = body.kilometer
        newCar.insurance = body.insurance
        newCar.letter = body.letter
        newCar.ccm = body.ccm
        newCar.power = body.power
        newCar.price = body.price
        newCar.priceWeekend = body.priceWeekend
        newCar.deposit = body.deposit
        newCar.description = body.description
        newCar.vmax = body.vmax
        newCar.doors = body.doors
        newCar.priceOneDay = body.priceOneDay
        newCar.prepayment = body.prepayment
        newCar.engine = body.engine
        newCar.petrol = body.petrol
        newCar.passengers = body.passengers
        newCar.age = body.age
        newCar.deductible = body.deductible
        newCar.license = body.license
        newCar.inclKilometers = body.inclKilometers
        newCar.extra_price_km = body.extra_price_km
        if (main_img) {
            newCar.main_img = main_img.id
        }
        newCar.published = false
        await newCar.save()
        return response.redirect('/admin/cars/edit/'+newCar.id)
    }
}

module.exports = CarController
