'use strict'
const nhtsa = use('nhtsa')

class AdminController {
    async nhtsa({ params }) {
        
        const { data } = await nhtsa.decodeVin(params.id);
        
        return data;
    }
}

module.exports = AdminController
