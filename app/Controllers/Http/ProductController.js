'use strict'
const Car = use('App/Models/Car')

const slugify = use('slugify')
function formatCurr(numb) {
    let n = 2;
    let x = 3;
    let s = ".";
    let c = ",";
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")",
      num = numb.toFixed(Math.max(0, ~~n));

    let res = (c ? num.replace(".", c) : num).replace(
      new RegExp(re, "g"),
      "$&" + (s || ",")
    );
    return res.replace(",00",",-")
  }
class ProductController {

  async start({ params, view }) {
    let cars = await Car.query().where("published", true).with("images").with("mainimg").fetch()
    return view.render('Pages/index',{formatCurr,cars:cars.toJSON()})
  }

  async single({ params, view }) {
    let car = await Car.findOrFail(params.carid)
    await car.load('images')
    await car.load('features')
    await car.load('mainimg')
    let carJSN = car.toJSON()
    var dt = new Date();     
    var weekend;
    if(dt.getDay() == 6 || dt.getDay() == 0){
      weekend = 1;
    }else{
      weekend = 0;
    }    
    return view.render("Pages/car", {JSON,formatCurr,params, car: carJSN, weekend: weekend})
  }

  async single_old({ params, view }) {
    let car = await Car.findOrFail(params.carid)
    await car.load('images')
    await car.load('features')
    await car.load('mainimg')
    let carJSN = car.toJSON()
    var dt = new Date();     
    var weekend;
    if(dt.getDay() == 6 || dt.getDay() == 0){
      weekend = 1;
    }else{
      weekend = 0;
    }    
    return view.render("Pages/car_old", {JSON,formatCurr,params, car: carJSN, weekend: weekend})
  }

  async index({ params, view }) {
    let cars;
    if (params.cat){
      cars = await Car.query().where("category", params.cat).where("published", true).where("type", "New").with("images").with("mainimg").orderBy('category').fetch()
    }else{
      cars = await Car.query().where("published", true).where("type", "New").with("images").with("mainimg").orderBy('category').fetch()
    }

      return view.render("Pages/cars",{slugify,formatCurr,cars:cars.toJSON()})
  }

  async oldtimer({ params, view }) {
    let cars;
    if (params.cat){
      cars = await Car.query().where("category", params.cat).where("published", true).where("type", "Old").with("images").with("mainimg").orderBy('category').fetch()
    }else{
      cars = await Car.query().where("published", true).where("type", "Old").with("images").with("mainimg").orderBy('category').fetch()
    }

    return view.render("Pages/cars_old",{slugify,formatCurr,cars:cars.toJSON()})
  }

  

  // async oldtimers({ params, view }) {
  //   let cars;
  //   if (params.cat){
  //     cars = await Car.query().where("category", params.cat).where("published", true).with("images").with("mainimg").orderBy('category').fetch()
  //   }else{
  //     cars = await Car.query().where("published", true).with("images").with("mainimg").orderBy('category').fetch()
  //   }
  //     return view.render("Pages/cars",{slugify,formatCurr,cars:cars.toJSON()})
  // }
}

module.exports = ProductController
