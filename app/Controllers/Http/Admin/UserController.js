'use strict'
const { validate } = use('Validator')
const User = use("App/Models/User")
const Hash = use('Hash')

class UserController {
    async login ({ auth, request,session,response }) {
        const rules = { email: 'required', password: 'required' }
        const validation = await validate(request.all(), rules)
        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }
        
        const { email, password } = request.all()
        try{
            await auth.attempt(email, password)
        }catch(e){
            console.log(e)
            session.withErrors({combination:"Wrong"}).flashAll()
            return response.redirect('back')
        }
    
        return  response.redirect("/admin/dashboard")
    }
    async logout({auth,response}){
        await auth.logout()
        return response.redirect("/admin/dashboard")
    }
    async createDefault({}){
        return  await Hash.make("Unterspieler123?")
    }

    async changePW({auth,session,request,response}){
        const rules = { password_check: 'required', password: 'required' }
        const validation = await validate(request.all(), rules)
        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }
        const {password,password_check} = request.all()
        if(password != password_check){
            session.withErrors({check:"failed"}).flashAll()
            return response.redirect('back')
        }

        let user = await User.find(auth.user.id)
        user.password = password
        await user.save()
        session.withErrors({success:"success"}).flashAll()
        return response.redirect('back')
        
    }

    async list({view,auth,response,request,params}){
        
        let users = await User.query().fetch()
        return view.render("Pages/Admin/users",{users:users.toJSON()})
    }

    async create({view,auth,response,request,params,session}){
        

        const rules = {
            email: 'required|email|unique:users,email',
            firstname: 'required',
            lastname: 'required',
            password: 'required'
        }
  
        const validation = await validate(request.all(), rules)
        if (validation.fails()) {
            session
              .withErrors(validation.messages())
              .flashExcept(['password'])
            return response.redirect('back')
        }
        let user = new User()
        let {admin,email,password,firstname,lastname} = request.all()
        user.email = email
        user.password = password
        user.firstname = firstname
        user.lastname = lastname
        user.login_source = "UNKNOWN"
        user.account_status = "active"
        await user.save()
        return response.redirect("/admin/users")
      
    }

    async editShow({view,auth,response,request,params}){
        
        let user = await User.find(params.id)
        return view.render("Pages/Admin/Users/edit",{user})
    }

    async edit({view,auth,response,request,params,session}){
        

        const rules = {
            email: 'required|email',
        }
  
        const validation = await validate(request.all(), rules)
        if (validation.fails()) {
            session
              .withErrors(validation.messages())
              .flashExcept(['password'])
            return response.redirect('back')
        }
        let user = await User.findOrFail(params.id)
        let {admin,email,password,firstname,lastname} = request.all()
        user.email = email
        if(password){
            user.password = password
        }
        user.firstname = firstname
        user.lastname = lastname
        await user.save()
        return response.redirect("/admin/users")
    }

    async delete({view,auth,response,request,params}){
        
        let user = await User.findOrFail(params.id)
        await user.delete()
        return response.redirect("/admin/users")
    }

}

module.exports = UserController
