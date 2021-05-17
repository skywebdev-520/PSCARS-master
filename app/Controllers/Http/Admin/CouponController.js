'use strict'
const Coupon = use('App/Models/Coupon')

class CouponController {
    
    async index({ view }) {
        return view.render("Pages/Admin/Coupons", { coupons: (await Coupon.all()).toJSON() })
    }
    async add({ response, request }) {
        const body = request.all()
        let feat = new Coupon()
        feat.type = body.type
        feat.code = body.code
        feat.description = body.descriptions
        feat.value = body.value
        feat.amount = body.amount
        feat.valid = body.valid
        await feat.save()
        return response.redirect('/admin/coupons')
    }
    async delete({ response, params}) {
        let feat = await Coupon.findOrFail(params.id)
        await feat.delete()
        return response.redirect('/admin/coupons')
    }
}

module.exports = CouponController
