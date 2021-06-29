'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/', ({ view, antl }) => {
    return view.render('Pages/index', { locales: antl.availableLocales() })
  })
// Route.get("/",({response})=>response.redirect('https://premium-sport-cars.de/'))
Route.get('/',"ProductController.start")
Route.get('/fahrzeuge',"ProductController.index")
Route.get('/fahrzeuge/kategorie/:cat',"ProductController.index")
Route.get('/fahrzeuge/:carid',"ProductController.single")
Route.get('/fahrzeuge/:carid/:slug',"ProductController.single")
Route.get('/oldtimer',"ProductController.oldtimer")
Route.get('/oldtimer/kategorie/:cat',"ProductController.oldtimer")
Route.get('/oldtimer/:carid',"ProductController.single")
Route.get('/oldtimer/:carid/:slug',"ProductController.single_old")
Route.get('/buchen/:carid',"CheckoutController.index")
Route.post('/buchen',"CheckoutController.book")
Route.get('/success/:orderid',"CheckoutController.thankyou")
Route.post('/coupon',"CheckoutController.coupon")


Route.group(() => {

    Route.post('/login', 'Admin/UserController.login')
    Route.get('/logout', 'Admin/UserController.logout').middleware(["auth"])
    Route.get('/create/hf2343NJdsfahjsdb/', 'Admin/UserController.createDefault')

    Route.get("/users","Admin/UserController.list").middleware(["auth"])
    Route.on("/users/add").render("Pages/Admin/Users/add").middleware(["auth"])
    Route.post("/users/add","Admin/UserController.create").middleware(["auth"])
    Route.post("/users/edit/:id","Admin/UserController.edit").middleware(["auth"])
    Route.get("/users/edit/:id","Admin/UserController.editShow").middleware(["auth"])
    Route.get("/users/delete/:id","Admin/UserController.delete").middleware(["auth"])    
    // Route.on('/login').render('Pages/Admin/login')
    // Route.on('/forgot').render('Pages/Admin/forgot')
    // Route.on('/forgot/send').render('Pages/Admin/forgot_send')
    // Route.on('/forgot/failed').render('Pages/Admin/forgot_failed')
    // Route.on('/forgot/check/:id').render('Pages/Admin/forgot_succ')
    Route.on('/').render('Pages/Admin/login')
    Route.get('/dashboard','Admin/DashboardController.index').middleware(["auth"])
    Route.get('/calendar','Admin/DashboardController.calendar').middleware(["auth"])
    
    Route.on('/customers').render('Pages/Admin/Customers/index').middleware(["auth"])
    Route.on('/customers/:id').render('Pages/Admin/Customers/view').middleware(["auth"])
    
    Route.on('/contracts').render('Pages/Admin/Contracts/index').middleware(["auth"])
    Route.on('/contracts/:id').render('Pages/Admin/Contracts/view').middleware(["auth"])

    Route.on('/receipts').render('Pages/Admin/Receipts/index').middleware(["auth"])
    Route.on('/receipts/:id').render('Pages/Admin/Receipts/view').middleware(["auth"])
    
    Route.post('/damages/add/book/:id',"Admin/DamageController.addBookingImages").middleware(["auth"])

    Route.get('/damages/add',"Admin/DamageController.createView").middleware(["auth"])
    Route.get('/damages/book/:id',"Admin/DamageController.getDmgsByBooking").middleware(["auth"])
    Route.post('/damages/add',"Admin/DamageController.create").middleware(["auth"])
    Route.get('/damages',"Admin/DamageController.index").middleware(["auth"])
    Route.on('/damages/delete/:id').render('Pages/Admin/damages/index').middleware(["auth"])
    Route.get('/damages/view/:id',"Admin/DamageController.view").middleware(["auth"])
    Route.post('/damages/view/:id',"Admin/DamageController.update").middleware(["auth"])
    Route.get('/damages/view/:id/images',"Admin/DamageController.images").middleware(["auth"])
    Route.post('/damages/view/:id/images',"Admin/DamageController.addImages").middleware(["auth"])
    Route.get('/damages/view/:rid/images/:id/del',"Admin/DamageController.delImages").middleware(["auth"])
    
    Route.get('/orders/:id/pickup', "Admin/OrderController.pickup").middleware(["auth"])
    Route.get('/orders/:id/return', "Admin/OrderController.deliver").middleware(["auth"])
    Route.post('/orders/:id/pickup/docs', "Admin/OrderController.pickupDocs").middleware(["auth"])
    Route.post('/orders/:id/pickup/payment', "Admin/OrderController.setPaid").middleware(["auth"])
    Route.post('/orders/:id/pickup/kilometer', "Admin/OrderController.setKilometer").middleware(["auth"])
    Route.post('/orders/:id/deliver/kilometer', "Admin/OrderController.setKilometerDeliver").middleware(["auth"])
    Route.post('/orders/:id/pickup/save', "Admin/OrderController.savePickup").middleware(["auth"])
    Route.get('/orders/:id/setPrePaid', "Admin/OrderController.setPrePaid").middleware(["auth"])
    Route.get('/orders', "Admin/OrderController.index").middleware(["auth"])
    Route.get('/statistics', "Admin/StatisticsController.index").middleware(["auth"]) 
    Route.get('/orders/:id', "Admin/OrderController.single").middleware(["auth"])
    Route.get('/orders/:id/cancel', "Admin/OrderController.cancel").middleware(["auth"])
    Route.get('/orders/:id/delete', "Admin/OrderController.delete").middleware(["auth"])
    Route.get('/orders/:id/contract', "Admin/OrderController.getContract").middleware(["auth"])
    Route.get('/orders/:id/agreement', "Admin/OrderController.getAgreement").middleware(["auth"])
    Route.get('/orders/:id/receiptdeposit', "Admin/OrderController.getReceiptDeposit").middleware(["auth"])
    Route.get('/orders/:id/receiptdeposit1', "Admin/OrderController.getReceiptDeposit1").middleware(["auth"])
    Route.get('/orders/:id/handover', "Admin/OrderController.getHandOver").middleware(["auth"])
    Route.get('/orders/:id/takeover', "Admin/OrderController.getTakeOver").middleware(["auth"])

    Route.get('/coupons',"Admin/CouponController.index").middleware(["auth"])
    Route.post('/coupons',"Admin/CouponController.add").middleware(["auth"])
    Route.get('/coupons/:id',"Admin/CouponController.delete").middleware(["auth"])

    Route.get('/blocks',"Admin/BlockController.index").middleware(["auth"])
    Route.post('/blocks',"Admin/BlockController.add").middleware(["auth"])
    Route.get('/blocks/:id',"Admin/BlockController.delete").middleware(["auth"])

    Route.get('/cars',"Admin/CarController.index").middleware(["auth"])
    Route.on('/cars/archive').render('Pages/Admin/Cars/archive').middleware(["auth"])
    Route.on('/cars/deleted').render('Pages/Admin/Cars/deleted').middleware(["auth"])
    Route.get('/cars/nhtsa/:id', 'AdminController.nhtsa').middleware(["auth"])
    //Route.on('/cars/add').render('Pages/Admin/Cars/add/step1')
    Route.get('/cars/add', ({view})=>view.render('Pages/Admin/Cars/add/step2')).middleware(["auth"])
    Route.post('/cars/add', "Admin/CarController.add").middleware(["auth"])
    Route.get('/cars/edit/:id', 'Admin/CarController.single').middleware(["auth"])
    Route.post('/cars/edit/:id', 'Admin/CarController.update').middleware(["auth"])
    Route.get('/cars/edit/:id/images', 'Admin/CarController.images').middleware(["auth"])
    Route.post('/cars/edit/:id/images', 'Admin/CarController.addImage').middleware(["auth"])
    Route.get('/cars/edit/:id/damages', 'Admin/CarController.damages').middleware(["auth"])
    Route.get('/cars/edit/:id/images/:imgId/delete', 'Admin/CarController.deleteImage').middleware(["auth"])
    Route.get('/cars/edit/:id/features',"Admin/CarController.carFeatures").middleware(["auth"])
    Route.get('/cars/edit/:id/features/add/:fetID',"Admin/CarController.adFeatToCar").middleware(["auth"])
    Route.get('/cars/edit/:id/features/remove/:fetID',"Admin/CarController.rmFeatToCar").middleware(["auth"])
    Route.get('/features',"Admin/CarController.featuresIndex").middleware(["auth"])
    Route.post('/features',"Admin/CarController.featuresAdd").middleware(["auth"])
    Route.get('/features/:id',"Admin/CarController.featuresDelete").middleware(["auth"])
    Route.get('/cars/edit/:id/kilometers',"Admin/CarController.kilometerIndex").middleware(["auth"])
    Route.post('/cars/edit/:id/kilometers',"Admin/CarController.kilometerAdd").middleware(["auth"])
    Route.get('/cars/edit/:id/kilometers/del/:fedid',"Admin/CarController.kilometerDelete").middleware(["auth"])
}).prefix('admin')