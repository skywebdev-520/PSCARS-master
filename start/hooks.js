const { hooks } = require('@adonisjs/ignitor')
const Helpers = use('Helpers')

const mixManifest = require(Helpers.publicPath('mix-manifest.json'))

hooks.after.providersBooted(async () => {
    const View = use('View')

    const Car = use('App/Models/Car')

    const cars = await Car.query().with("mainimg").limit(4).fetch()
    View.global("gcars",cars.toJSON())


    View.global('versionjs', (filename) => {
        filename = `/js/${filename}.js`
        if (!mixManifest.hasOwnProperty(filename)) {
            throw new Error('Could not find asset for versioning' + filename)
        }

        return mixManifest[filename]
    })

    View.global('versioncss', (filename) => {
        filename = `/css/${filename}.css`
        if (!mixManifest.hasOwnProperty(filename)) {
            throw new Error('Could not find asset for versioning' + filename)
        }

        return mixManifest[filename]
    })
})