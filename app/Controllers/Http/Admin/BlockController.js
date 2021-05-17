'use strict'
const Blocks = use('App/Models/Blocked')
const Car = use('App/Models/Car')

const moment = use('moment')

class BlocksController {
    
    async index({ view }) {
        let blocked = await Blocks.query().with("car").fetch()
        return view.render("Pages/Admin/Block", { Blocks: blocked.toJSON(), Cars: (await Car.all()).toJSON() })
    }
    async add({ response, request }) {
        const body = request.all()
        let feat = new Blocks()
        feat.checkout = moment(body.checkout,"DD.MM.YYYY").format("YYYY-MM-DD")
        feat.checkin = moment(body.checkin,"DD.MM.YYYY").format("YYYY-MM-DD")
        feat.car_id = body.car_id
        await feat.save()
        return response.redirect('/admin/blocks')
    }
    async delete({ response, params}) {
        let feat = await Blocks.findOrFail(params.id)
        await feat.delete()
        return response.redirect('/admin/blocks')
    }
}

module.exports = BlocksController
