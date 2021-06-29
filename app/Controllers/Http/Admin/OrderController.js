'use strict'

const Booking = use("App/Models/Booking")
const PDF = use('PDF')
const moment = use('moment')
const Helpers = use('Helpers')
const uuidv1 = use('uuid/v1')
const Feature = use('App/Models/Feature')
const Car = use('App/Models/Car')
const curr = require("currency-formatter")
const Mail = use('Mail')


class OrderController {
    async index({ view }) {        
        let orders = await Booking.query().with("car").with("customer").orderBy("id","DESC").fetch()        
        return view.render('Pages/Admin/Orders/index',{orders:orders.toJSON(),moment})
    }

    async setKilometerDeliver({params,request}){
        let book = await Booking.findOrFail(params.id)
        let car = await Car.findOrFail(book.car_id)
        let body = request.all()
        car.kilometer = body.kilometer
        await car.save()
        book.status = "ABGESCHLOSSEN"
        await book.save()
        return true
    }
    async cancel({response,params}){
        let book = await Booking.findOrFail(params.id)
        book.status = "STORNIERT"
        await book.save()
        return response.redirect("back")
    }
    async delete({response,params}){
        let book = await Booking.findOrFail(params.id)
        await book.delete()
        return response.redirect("back")
    }
    async single({ view, params }) {
        let book = await Booking.findOrFail(params.id)
        return view.render('Pages/Admin/Orders/view', { book,moment })
    }

    async pickup({view,params}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        return view.render('Pages/Admin/Orders/pickup', {  book:JSON.stringify(book.toJSON()) })
    }
    async deliver({view,params}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        return view.render('Pages/Admin/Orders/deliver', {  book:JSON.stringify(book.toJSON()) })
    }
    async savePickup({params,request}){
        let book = await Booking.findOrFail(params.id)
        let body = request.all()
        book.isDelivered = body.isDelivered
        book.isSigned = body.isSigned
        book.signature = body.signature
        book.signature_customer = body.signature_customer
        book.status ="ABGEHOLT"
        await book.save()
        return true
    }
    async setKilometer({params,request}){
        let book = await Booking.findOrFail(params.id)
        let car = await Car.findOrFail(book.car_id)
        let body = request.all()
        car.kilometer = body.kilometer
        await car.save()
        return true
    }
    async setPaid({params,request}){
        let book = await Booking.findOrFail(params.id)
        let body = request.all()
        book.isPaid = body.isPaid
        await book.save()
        await Mail.send('email/notify/deductible', {curr,moment,book:book.toJSON()}, (message) => {
            message
              .to(book.customer_email)
              .from('info@premium-sport-cars.de')
              .subject('PSC - Bestätigung der Kautionszahlung')
        })
        return true
    }
    async pickupDocs({params,request}){
        let book = await Booking.findOrFail(params.id)
        const perso_front_file = request.file('perso_front_file', { types: ['image'], size: '20mb' })
        const perso_back_file = request.file('perso_back_file', { types: ['image'], size: '20mb' })
        const license_front_file = request.file('license_front_file', { types: ['image'], size: '20mb' })
        const license_back_file = request.file('license_back_file', { types: ['image'], size: '20mb' })
        const perso_2_front_file = request.file('perso_2_front_file', { types: ['image'], size: '20mb' })
        const perso_2_back_file = request.file('perso_2_back_file', { types: ['image'], size: '20mb' })
        const license_2_front_file = request.file('license_2_front_file', { types: ['image'], size: '20mb' })
        const license_2_back_file = request.file('license_2_back_file', { types: ['image'], size: '20mb' })

        let perso_front_file_path = ""
        let perso_back_file_path = ""
        let license_front_file_path = ""
        let license_back_file_path = ""
        let perso_2_front_file_path = ""
        let perso_2_back_file_path = ""
        let license_2_front_file_path = ""
        let license_2_back_file_path = ""

        if ( perso_front_file ) {
            perso_front_file_path = uuidv1()+"."+perso_front_file.extname
            await perso_front_file.move(Helpers.publicPath('uploads'),{name:perso_front_file_path,overwrite:true})
        }
        if ( perso_back_file ) {
            perso_back_file_path = uuidv1()+"."+perso_back_file.extname
            await perso_back_file.move(Helpers.publicPath('uploads'),{name:perso_back_file_path,overwrite:true})
        }
        if ( license_front_file ) {
            license_front_file_path = uuidv1()+"."+license_front_file.extname
            await license_front_file.move(Helpers.publicPath('uploads'),{name:license_front_file_path,overwrite:true})
        }
        if ( license_back_file ) {
            license_back_file_path = uuidv1()+"."+license_back_file.extname
            await license_back_file.move(Helpers.publicPath('uploads'),{name:license_back_file_path,overwrite:true})
        }
        if ( perso_2_front_file ) {
            perso_2_front_file_path = uuidv1()+"."+perso_2_front_file.extname
            await perso_2_front_file.move(Helpers.publicPath('uploads'),{name:perso_2_front_file_path,overwrite:true})
        }
        if ( perso_2_back_file ) {
            perso_2_back_file_path = uuidv1()+"."+perso_2_back_file.extname
            await perso_2_back_file.move(Helpers.publicPath('uploads'),{name:perso_2_back_file_path,overwrite:true})
        }
        if ( license_2_front_file ) {
            license_2_front_file_path = uuidv1()+"."+license_2_front_file.extname
            await license_2_front_file.move(Helpers.publicPath('uploads'),{name:license_2_front_file_path,overwrite:true})
        }
        if ( license_2_back_file ) {
            license_2_back_file_path = uuidv1()+"."+license_2_back_file.extname
            await license_2_back_file.move(Helpers.publicPath('uploads'),{name:license_2_back_file_path,overwrite:true})
        }

        let body = request.all()
        if(body.license_nr){
            book.license_nr = body.license_nr[0]
        }
        if(body.license_class){
            book.license_class = body.license_class[0]
        }
        if(body.license_date){
            book.license_date = body.license_date[0]
        }
        book.perso_front_file = perso_front_file_path
        book.perso_back_file = perso_back_file_path
        book.license_front_file = license_front_file_path
        book.license_back_file = license_back_file_path
        book.perso_2_front_file = perso_2_front_file_path
        book.perso_2_back_file = perso_2_back_file_path
        book.license_2_front_file = license_2_front_file_path
        book.license_2_back_file = license_2_back_file_path
        if(body.mieter2){
            book.mieter2 = body.mieter2
        }

        await book.save()
        return true;
    }
    async setPrePaid ({params,request,response}){
        let book = await Booking.findOrFail(params.id)
        let body = request.all()
        book.status = "GEMIETET"
        await book.save()
        return response.redirect("back")
    }
    async getContract({response,params,auth}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        book = book.toJSON()
        let featId = JSON.parse(book.features)
        let features = await Feature.query().whereIn("id",featId).fetch()
        features = features.toJSON()

        let signature_div_customer = {text: "\n\n\n\n\n\n"}
        let signature_div = {text: "\n\n\n\n\n\n"}
        if(book.isSigned) {
            if(book.signature_customer){
                signature_div_customer = {width:100,image:book.signature_customer}
            }
            if(book.signature){
                signature_div = {width:100,image:book.signature}
            }
        } 
        const content = [
            { 
                style:"default",
                columns: [
                    [
                        " "," "," "," "
                        ," "," "," "," ",
                        {
                            table: {
                                headerRows: 1,
                                widths: [ '40%', '*' ],
                                body: [
                                    [ 
                                        { text:'Mietvertrag über einen Personenkraftwagen', alignment:'left',colSpan: 2,bold: true, fontSize:11,border:[false,false,false,false] }, 
                                        "" 
                                    ],
                                    [ 
                                        {rowSpan:2,text:'Mieter 1:\n'+book.customer_firstname+" "+book.customer_lastname,borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]}, 
                                        {text:'Antragsteller: '+auth.user.firstname+" "+auth.user.lastname,borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]} 
                                    ],
                                    [ 
                                        '', 
                                        {text:'Führerschein Nr.: ••••••••'+(book.license_nr?book.license_nr.substr(book.license_nr.length - 4):""),borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]} 
                                    ],
                                    [ 
                                        {rowSpan:2,text:'Adresse:\n'+book.customer_address+", "+book.customer_postcode+" "+book.customer_city,borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]}, 
                                        {text:'Austellungsdatum: '+(book.license_date?book.license_date:""),borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]} 
                                    ],
                                    [ 
                                        '', 
                                        {text:'Fahrerlaubnisklassen: '+(book.license_class ?book.license_class:""),borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]} 
                                    ],
                                    [ 
                                        {rowSpan:2,text:book.mieter2?'Mieter 2:\n'+book.mieter2:"",borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]}, 
                                        {text:'Lichtbild- und Gültigkeitsprüfung durchgeführt: Ja',borderColor:["#4A4D52","#4A4D52","#4A4D52","#fff"]} 
                                    ],
                                    [ 
                                        '', 
                                        {text:'Vertragsnummer: '+book.id,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]} 
                                    ],
                                ]
                            }
                        },
                        " ",
                        {text:"- nachstehend \"Mieter\" genannt -",marginLeft:10},
                        " ",
                        "und",
                        " ",
                        "Premium Sport-Cars GmbH",
                        "Ludwig-Erhard-Str. 8, 28197 Bremen",
                        " ",
                        {text:"- nachstehend \"Vermieter\" genannt -",marginLeft:10},
                        
                        " ",
                        "vereinbaren folgendes:",
                        "Der Vermieter überlässt dem Mieter unter Anerkennung der nachfolgenden allgemeinen Mietbedingungen der Premium Sport-Cars GmbH für die Vermietung von Personenkraftfahrzeugen (AMB) zum vertraglich vereinbarten Verwendungszweck gem. Ziffer 2 Nr. 2 AMB das Nichtraucherfahrzeug",
                        " ",
                        {
                            table: {
                                
                                headerRows: 1,
                                widths: [ '*','*','*', '*' ],
                                body: [
                                    [ 
                                        { 
                                            text:'Fahrzeug',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Fahrzeug-Id-Nr.',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Kennzeichen',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Bereifung',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                    ],
                                    [ 
                                        {text: book.car.title.replace(/<[^>]*>?/gm, ''),alignment:'center',borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: book.car.vin,alignment:'center', borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: book.car.plate,alignment:'center',borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: book.car.location,alignment:'center',borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                ]
                            }
                        },
                        " ",
                        "für die Zeit vom "+moment(book.checkin).format("DD.MM.YYYY")+" "+ book.checkin_time +" Uhr bis "+moment(book.checkout).format("DD.MM.YYYY")+" "+ book.checkout_time +" Uhr bei einem KM-Stand "+book.car.kilometer+" zum Gebrauch.",
                        " ",
                        "Das Fahrzeug wird mit einem vollständig gefüllten Kraftstofftank bzw. einer vollständig geladenen Fahrzeugbatterie übergeben und der Mieter hat das Fahrzeug am Ende der Mietzeit mit einem vollständig gefüllten Kraftstofftank bzw. einer vollständig geladenen Fahrzeugbatterie zurückzugeben. Wird das Fahrzeug nicht vollständig betankt zurückgegeben, beträgt die Aufwandsentschädigung pro Liter 3,00 EUR inklusive der gesetzlichen Umsatzsteuer.",
                        " ",
                        "Der Mieter hat während der Mietdauer pro "+(book.rangeType=="single"?"8 Stdn.":"24 Stdn.")+" "+(book.rangeType=="single"?book.car.inclKilometers:book.car.inclKilometers_day)+" Freikilometer. Darüber hinausgehende Kilometer werden mit "+curr.format(book.car.extra_price_km, { code: 'EUR' })+"/km inklusive der gesetzlichen Umsatzsteuer berechnet.",
                        " ",
                        "Die Kaution für das Fahrzeug beträgt "+book.car.prepayment+".",
                        " ",
                        "Für am Fahrzeug entstandene Schäden, die nicht vorsätzlich oder grob fahrlässig verursacht wurden, beträgt die Selbstbeteiligung des Mieters pro Schadenfall "+book.car.deductible+".",
                        " ",
                        "Kosten für Sonderleistungen (z.B. Zubehör oder Reduzierung der Selbstbeteiligung) werden zusätzlich zum Basismietpreis in Rechnung gestellt.",
                        " ",
                        "Der Basismietpreis Beträgt:",
                        " ",
                        {
                            table: {
                                headerRows: 1,
                                widths: [ 'auto','*','*', '*', '*' ],
                                body: [
                                    [ 
                                        { 
                                            text:'Zeitraum',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Netto Betrag',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'USt-Satz',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'USt-Betrag',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Gesamtbetrag',
                                            alignment:'center',
                                            fillColor:'#4A4D52', 
                                            color:"white",
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                    ],
                                    [ 
                                        {
                                            text:
                                            moment(book.checkin).format("DD.MM.YYYY")+" "+ book.checkin_time +" Uhr - " +
                                            moment(book.checkout).format("DD.MM.YYYY")+" "+ book.checkout_time +" Uhr",
                                            alignment:'center',borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text:curr.format( book.price_total-(book.price_total / 119 * 19) , { code: 'EUR' }),bold:true,alignment:"center",borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text:"19 %",bold:true,alignment:"center",borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text:curr.format((book.price_total / 119 * 19), { code: 'EUR' }),bold:true,alignment:"center",borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text:curr.format(book.price_total, { code: 'EUR' }),bold:true,alignment:"center",borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                ]
                            }
                        },
                        " ",
                        "Nach Ablauf des o.g. Mietzeitraums werden pro Tag "+curr.format(book.car.price,{code:"EUR"})+" inklusive der gesetzlichen Umsatzsteuer berechnet.",
                        " ",
                        {text:"Zusätzliche Leistung zum Mietvertrag:",bold:true},
                        " ",
                        {
                            columns: features.map(el=>({
                                text: el.title
                            }))
                        },
                        " ", 
                        {
                            columns: [
                                [
                                    signature_div,
                                    {
                                        width: 200,height:6,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    {
                                        text:"Unterschrift Vermieter"
                                    },
                                    "Bremen, den "+moment(book.checkin).format("DD.MM.YYYY")
                                ],
                                [
                                    signature_div_customer,
                                    {
                                        width: 200,height:6,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    {
                                        text:"Unterschrift Mieter",
                                    },
                                    "Bremen, den "+moment(book.checkin).format("DD.MM.YYYY")
                                ]
                            ]
                            
                        },
                        " ", 

                        {text:" ", pageBreak: 'before'}," "," "," "
                        ," "," "," "," ",
                        {text: "Hinweis: Achtung! Unabhängig von der Selbstbeteiligung haftet/haften der/die Mieter uneingeschränkt für den Ersatz der Wertminderung, Gutachter- und Abschleppkosten.", fontSize:13, bold:true},
                        " ",
                        "Zu beachten: Der Mieter ist für Park- und Verkehrsübertretungen verantwortlich. Dem Mieter ist bekannt, dass er verpflichtet ist, bei jedem Unfall oder Schaden am Fahrzeug die Polizei hinzuzuziehen, andernfalls entfallen die Vorteile aus der Haftungsreduzierung (siehe oben) je nach Schwere des Verschuldens bei Verstoß gegen diese Obliegenheit. Die Überlassung des Fahrzeuges an nicht aufgeführte Personen ist dem Mieter untersagt. Auslandsfahrten bedürfen ausdrücklich der schriftlichen Zustimmung des Vermieters. Das Übernahmeprotokoll ist Bestandteil dieses Mietvertrages.",
                        " ",
                        "Durch meine Unterschrift bestätige ich als Mieter, dass ich in die derzeit gültige Preisliste bei Abschluss des Mietvertrages Einsicht nehmen konnte. Die Preisliste ist ausdrücklich Bestandteil des Mietvertrages. Des Weiteren bestätige ich durch meine Unterschrift, dass ich die umseitigen, diesem Mietvertrag zugrundeliegenden Allgemeinen Geschäftsbedingungen als auch den Mietvertrag selbst sowie die Anlagen/das Übernahmeprotokoll gelesen habe und diese akzeptiere. Entsprechende Durchschläge wurden mir ausgehändigt. ",
                        'Information und schriftliche Einwilligung gemäß Datenschutz',
                        " ",
                        "Die von Ihnen angegebenen personenbezogenen Daten, die zum Zwecke der Durchführung des entstehenden Vertragsverhältnisses notwendig und erforderlich sind, werden auf Grundlage gesetzlicher Berechtigungen nach Art. 6, Abs. 1b,c DS-GVO erhoben.",
                        " ",
                        {text: 'Ihre Rechte: Auskunft, Berichtigung, Einschränkung, Übertragung, Löschung', fontSize:13, bold:true},
                        " ",
                        "Sie sind gemäß Art. 15 DS-GVO jederzeit berechtigt, bei uns um umfangreiche Auskunftserteilung zu den zu Ihrer Person gespeicherten Daten zu ersuchen und / oder die Berichtigung (Art. 16 DS-GVO), Löschung (Art. 17 DS-GVO), Einschränkung der Verarbeitung (Art. 18 DS-GVO) zu verlangen sowie Ihr Recht auf Datenübertragbarkeit (Art. 20 DS-GVO) ) und Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DS-GVO) sowie Ihr Recht auf Widerruf der Einwilligung /Art. 7 III DS-GVO) geltend zu machen.",
                        " ",
                        "Sie können die Wahrnehmung Ihrer sonstigen Rechte entweder persönlich, fernmündlich, postalisch, per E-Mail oder per Fax an unseren Verantwortlichen übermitteln. Es entstehen Ihnen dabei keine anderen Kosten als die Portokosten bzw. die Übermittlungskosten nach den bestehenden Basistarifen.",
                        " ",
                        "Für jede darüber hinausgehende Verwendung personenbezogener Daten und die Erhebung zusätzlicher Informationen zum Beispiel für Werbung oder Sonderangebote bedarf es der Einwilligung des Betroffenen. Eine solche Einwilligung können Sie im folgenden Abschnitt erteilen.",
                        " ",
                        {text: 'Einwilligung in die Datennutzung zu weiteren Zwecken', fontSize:13, bold:true},
                        " ",
                        "Sind Sie mit den folgenden Nutzungszwecken einverstanden? Kreuzen Sie diese bitte entsprechend an. Wollen Sie keine Einwilligung erteilen, lassen Sie die Felder bitte frei.",
                        " ",
                        {
                            columns: [
                                {text:"b", font:"Icons",width:20,fontSize:13},
                                {bold:true,text:"Ich willige ein, dass meine Daten über die anlassbezogene Abwicklung des Mietvertrages hinaus bei meinem Vertragspartner gespeichert werden können."}
                            ]
                        },
                        " ",
                        {
                            columns: [
                                {text:"b", font:"Icons",width:20,fontSize:13},
                                {bold:true,text:"Ich willige ein, dass meine Daten über die anlassbezogene Abwicklung des Mietvertrages hinaus bei einem Kooperationspartner im Rahmen einer Auftragsverarbeitung verwendet werden können."}
                            ]
                        },
                        " ",
                        {
                            columns: [
                                {text:"a", font:"Icons",width:20,fontSize:13},
                                {bold:true,text:"Ich willige ein, dass mir mein Vertragspartner im Rahmen der Werbung per E-Mail/Telefon/Fax/SMS* Informationen zu weiteren Mobilitätsangeboten und Preisen übersenden darf (* bei Einwilligung bitte Unzutreffendes streichen)."}
                            ]
                        },
                        " ",
                        "Sie haben das Recht, diese Einwilligung jederzeit und ohne Angabe von Gründen zu ändern oder zu widerrufen (Art. 21 DS-GVO) und können den Widerruf persönlich, fernmündlich, postalisch, per E-Mail oder per Fax an unseren Verantwortlichen übermitteln.",
                        " ",

                        {text:" ", pageBreak: 'before'}," "," "," "
                        ," "," "," ",
                        {text: 'Schadensbericht', fontSize:15, bold:true,alignment:"left"},
                        {
                            width:500,
                            image:"public/img/car_dmg/"+(book.car.damages.filter(el=>el.entries.length>0)[0]?book.car.damages.filter(el=>el.entries.length>0)[0].entries[0].type:"sportwagen")+".png"
                        },
                        ...book.car.damages.map(dmg=>dmg.entries.filter(el=>el.mark?true:false).map(entry=>({
                                image: entry.mark?entry.mark:null,
                                width:500,
                                absolutePosition: {x:40, y:120}
                        }))),

                        book.car.damages.length>0?{
                            layout:{
                                paddingTop: function(i, node) { return 8; },
                                paddingBottom: function(i, node) { return 8; }
                            },
                            table: {
                                headerRows: 0,
                                widths: [ '10%', '*' ],
                                body: [
                                    ...[].concat.apply([],book.car.damages.map(dmg=>dmg.entries.filter(el=>el.mark?true:false).map(entry=>(
                                        [
                                            {text: moment(entry.created_at).format("DD.MM.YYYY"),alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                            {text: entry.description,alignment:'left',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        ]
                                    )))),
                                    [{text:"",border:[false,false,false,false]},{text:"",border:[false,false,false,false]}]
                                ]
                            }
                        }:" ",
                        {text:" ", pageBreak: 'before'}," "," "," "
                        ," "," ",
                        {text: 'Pakete und Preise', fontSize:15, bold:true,alignment:"left"},
                        " "," ",
                        {
                            layout:{
                                paddingTop: function(i, node) { return 8; },
                                paddingBottom: function(i, node) { return 8; }
                            },
                            table: {
                                headerRows: 1,
                                widths: [ '30%','*','*', '*', '*' ],
                                body: [
                                    [ 
                                        { 
                                            text:'Model',
                                            alignment:'left',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'8 Stdn.\n100km',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'1 Tag\n150km',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'1 WE Fr - Mo\n450km',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'pro zusätzlich\ngefahrenem km',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                    ],
                                    [ 
                                        {text: 'Mercedes-AMG C 63 S Edition 1 (S)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '249.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '299,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '599,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '2,49',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Mercedes-AMG C 63 4MATIC (P)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '699.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '799,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '1.999,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '5,49',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Mercedes-AMG GT C Edition 50 (P)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '799.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '899,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '2.099,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '5,49',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Mercedes-Benz S 350 d (S)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '249.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '299,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '599,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '2,49',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Chevrolet Corvette Z06 (P)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '499.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '599,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '1.499,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '4,49',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                ]
                            }
                        },
                        " ",
                        " ",
                        {
                            layout:{
                                paddingTop: function(i, node) { return 8; },
                                paddingBottom: function(i, node) { return 8; }
                            },
                            table: {
                                headerRows: 1,
                                widths: [ '40%','*','*', '*' ],
                                body: [
                                    [ 
                                        { 
                                            text:'Zusätzlich buchbare Kilometerpakete',
                                            alignment:'left',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'100 km Paket',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'300 km Paket',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                        { 
                                            text:'500 km Paket',
                                            alignment:'center',
                                            fontSize:10,
                                            bold: true,border:[false,true,false,true] 
                                        },
                                    ],
                                    [ 
                                        {text: 'Mercedes-AMG C 63 S Edition 1 (S)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '199.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '399,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '599,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Mercedes-AMG C 63 4MATIC (P)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '499.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '699,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '899,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Mercedes-AMG GT C Edition 50 (P)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '499.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '699,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '899,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Mercedes-Benz S 350 d (S)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '199.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '399,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '599,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                    [ 
                                        {text: 'Chevrolet Corvette Z06 (P)',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '399.-',alignment:'center',border:[false,true,false,true] ,borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '599,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                        {text: '799,-',alignment:'center',border:[false,true,false,true],borderColor:["#4A4D52","#4A4D52","#4A4D52","#4A4D52"]},
                                    ],
                                ]
                            }
                        },
                        "Alle Preise in Euro inkl. 19% MwSt. Änderungen bleiben vorbehalten. Stand: April 2020",
                        " ",
                        " ",
                        {text:"Zahlungsbedingungen", bold:true},
                        "Bei Abholung des Mietautos ist eine Kaution zu hinterlegen, die Sie auch gerne in Form Ihres eigenen Fahrzeuges begleichen können. Bringen Sie dazu bitte Fahrzeugbrief- und –schein sowie Schlüssel mit.",
                        "Ansonsten beträgt die Höhe der Kaution für Fahrzeuge der Kategorie P 4.000,- € und für Mietautos der Kategorie S 2.000,- €. Bei der Bezahlung akzeptieren wir sowohl Girocard als auch Kreditkarte oder Barzahlung.",
                        " ",
                        {text:"Versicherung", bold:true},
                        "Im Mietpreis inbegriffen sind sowohl Haftpflicht- als auch Vollkaskoversicherung für das von Ihnen gebuchte Fahrzeug. Im Schadensfall haben Sie dabei lediglich eine Selbstbeteiligung von 6.000,- €. Eine Reduzierung um 50% kann gegen einen Aufpreis von 49,- € pro Tag erfolgen.",
                        " ",
                        {text:"Abholung und Rückgabe", bold:true},
                        "Die Fahrzeugabholung und -rückgabe ist nur während der Öffnungszeiten möglich. Bis zur Begutachtung durch einen Mitarbeiter von uns treffen den Mieter sämtliche Pflichten aus dem Mietvertrag (insb. Haftung für Schäden). Der Mieter muss bei der Abholung des Fahrzeugs ein Ausweisdokument (Personalausweis oder Reisepass in Verbindung mit einer aktuellen Meldebescheinigung) sowie einen gültigen Führerschein vorlegen.",
                        " ",
                        {text:"Altersbestimmung und weitere Fahrer", bold:true},
                        "Für das Mindestalter und den Führerscheinbesitz des Fahrers gelten folgende Regelungen: 21 Jahre / 3 Jahre. Weitere Fahrer werden gegen Gebühr berechtigt: 69,- € / Tag.",
                        " ",
                        {text:"Kosten für den Bring- und Abhol-Service", bold:true},
                        "bis ca. 100 km = 320,- €",
                        "bis ca. 300 km = 450,- €",
                        "bis ca. 500 km = 670,- €",
                        "Transportkosten zuzüglich Straßenbenutzung- und Tunnelgebühren.",
                        " ",
                        

                        {text: ' ', fontSize:10, bold:true, pageBreak: 'before'},
                        ," "," "," "
                        ," "," "," "," ",
                        {text: 'Allgemeine Mietbedingungen der Premium Sport-Cars GmbH für die Vermietung von Personenkraftfahrzeugen', fontSize:10, bold:true},
                        " ",
                        {
                            fontSize: 6,
                            columnGap: 10,
                            columns: [
                                [
                                    
                                    {text:"I. Allgemeine Bedingungen",bold:true},
                                    "Premium Sport-Cars GmbH (nachfolgend „Vermieter“ genannt) vermietet an den Mieter, ggf. auch mehrere Personen gegen Zahlung des vertraglich vereinbarten Mietpreises das im Mietvertrag näher bezeichnete Nichtraucherfahrzeug (nachfolgend „Mietwagen“ genannt) zum Zwecke der Nutzung gem. Ziffer II. Alle Mieter haften für alle Verpflichtungen aus diesem Vertrag gesamtschuldnerisch. Soweit nachstehend von dem Mieter oder dem Fahrer die Rede ist, sind damit jeweils alle Mieter bzw. Fahrer gemeint, unabhängig davon, ob männlich, weiblich oder mehrere.",
                                    " ",
                                    "Der Mieter oder dessen angestellter Fahrer bestätigt mit der Unterzeichnung des Mietvertrages, den Mietwagen vollgetankt erhalten zu haben. Beanstandungen jeglicher Art sind durch den Mieter unmittelbar nach Mietwagenübernahme gegenüber dem Vermieter geltend zu machen. Der im Mietvertrag angegebene Anfangskilometerstand wird als richtig anerkannt. Die jeweils gültige Preisliste, die Mietbedingungen und das Mietwagenübernahmeprotokoll sind Bestandteil des Mietvertrages.",
                                    " ",
                                    "Nebenabreden bedürfen der Schriftform. Änderungen und Ergänzungen des Mietvertragstextes sind nur gültig, wenn sie vom Vermieter schriftlich bestätigt sind.",
                                    " ",
                                    "Der Mieter wird hiermit darauf hingewiesen, dass ihm nach § 312g Abs. 2 Nr. 9 BGB ein besonderes Widerrufsrecht wegen außerhalb von Geschäftsräumen geschlossenen Verträgen nicht zusteht.",
                                    " ",
                                    "Der Mietvertrag ist abgeschlossen, wenn Mieter und Vermieter ihn schriftlich angenommen haben.",
                                    " ",
                                    
                                    {text:"II. Nutzung des Mietwagens",bold:true},
                                    "1. Der Mietwagen darf nur vom Mieter selbst und den im Mietvertrag angegebenen Personen sowie den bei einem gewerblichen Mieter angestellten Berufskraftfahrern in dessen Auftrag geführt werden. Voraussetzung ist der Besitz einer gültigen Fahrerlaubnis. Der Mieter hat das Handeln des Fahrers wie eigenes Handeln zu vertreten. Sollte entgegen diesem Vertrag ein Nichtberechtigter den Mietwagen führen, so haftet der Mieter auch für das Handeln des Nichtberechtigten, es sei denn, der Mieter legt dar, dass er dessen Handeln nicht zu vertreten hat.",
                                    "2. Die Nutzung des Mietwagens zur gewerblichen Personen- und Güterbeförderung ist nur bei gesonderter vertraglicher Vereinbarung und unter Beachtung der gesetzlichen Bestimmun-gen zulässig. Es ist dem Mieter untersagt, den Mietwagen zu motorsportlichen- oder Testzwecken sowie zu Zollvergehen und sonstigen Straftaten zu verwenden, auch wenn diese nur nach dem Recht des Tatlandes mit Strafe bedroht sind. Fahrten außerhalb der Bundesrepublik Deutschland bedürfen ausdrücklich der vorherigen schriftlichen Zustimmung des Vermieters.",
                                    "3. Der Mieter verpflichtet sich, den Mietwagen schonend zu behandeln, die straßenverkehrsrechtlichen Vorschriften einzuhalten und den Mietwagen gegen Diebstahl sorgfältig abzusichern. Die Verkehrssicherheit ist während der Mietzeit regelmäßig zu kontrollieren.",
                                    " ",
                                    
                                    {text:"III. Mietpreis, Mietdauer, Rückgabe, Übergabeort",bold:true},
                                    "1. Der Mietpreis ergibt sich aus der jeweils gültigen Preisliste oder bedarf einer gesonderten Vereinbarung. Die Preisliste ist Bestandteil des Mietvertrages. Die Leistung des Vermieters beinhaltet Wartungsdienst, Ölverbrauch, Verschleißreparaturen und eine Haftpflichtversicherung, nicht jedoch Treibstoffkosten.",
                                    "2. Der Mietwagen ist zum Ablauf der vereinbarten Mietdauer zu den üblichen Geschäftszeiten in der vereinbarten Mietstation zurückzugeben. Erfolgt die Rückgabe nicht in der vereinbarten Filiale, kann der Vermieter die Kosten der Rückführung erstattet verlangen.",
                                    "3. Die Mindestmietdauer beträgt 8 Stunden.",
                                    "4. Die Verlängerung der Mietdauer bedarf der Zustimmung des Vermieters und ist dem Vermieter 24 Stunden vorher schriftlich oder telefonisch anzukündigen und genehmigen zu lassen. Ab einer schuldhaft überzogenen Mietzeit von mehr als 30 Minuten wird ein weiterer Miettag berechnet. Bei schuldhafter Überschreitung der Rückgabefrist um mehr als 24 Stunden ist der Vermieter berechtigt, zusätzlich eine Pauschale von EUR 99,- inkl. MwSt. pro angefangenem Tag zu verlangen. Dem Mieter steht es in allen Fällen frei nachzuweisen, dass der Vermieter keinen oder nur einen geringeren Schaden erlitten hat. Darüber hinaus behält sich der Vermieter weitergehende Schadenersatzansprüche vor. Bei verspäteter – nicht genehmigter – Rückgabe haftet der Mieter für alle nach Vertragsablauf eingetretenen und von ihm zu vertretenen Schäden an dem Mietwagen in voller Höhe, ungeachtet eines vereinbarten Haftungsausschlusses.",
                                    "5. Der Mietwagen ist vollgetankt zurückzugeben. Anderenfalls werden Betankungskosten entsprechend der Preisliste berechnet.",
                                    "6. Grundsätzlich ist die Übergabe des Mietwagens nur innerhalb der Öffnungszeiten der Filiale möglich.",
                                    "7. Bei Vertragsverletzungen durch den Mieter oder dessen Fahrer ist der Vermieter zur fristlosen Kündigung des Vertrages berechtigt.",
                                    "8. Die Geschäftsbedingungen und die Preisliste gelten bei Mietwagentausch unverändert weiter.",
                                    " ",
                                ],
                                [
                                    {text:"VII. Versicherung",bold:true},
                                    "Der Mietwagen ist auf den Vermieter zugelassen. Der Vermieter hat für den Mietwagen eine Kfz-Versicherung für die Zeit der Überlassung an den Mieter abgeschlossen. Gemäß Ziffer VIII. haftet der Mieter für selbstverschuldete Schäden am Mietwagen bis zur Höhe der im Mietvertrag vereinbarten Selbstbeteiligung. Jeder im Rahmen des Mietvertrages vereinbarte Versicherungsschutz entfällt insbesondere, wenn ein unberechtigter Fahrer den Mietwagen gebraucht, wenn der Fahrer des Mietwagens bei Eintritt des Versicherungsfalles nicht die vorgeschriebene Fahrerlaubnis hat oder den Mietwagen für die Beförderung gefährliche Stoffe gem. Anlage 1 Gefahrengutverordnung Straße, Eisenbahn und Binnenschifffahrt (GGVSEB) verwendet wird.",
                                    " ",
                                    
                                    {text:"VIII. Haftung",bold:true},
                                    "1. Trotz einer Vollkaskoversicherung haftet der Mieter unbegrenzt für den gesamten Schaden, wenn er diesen vorsätzlich herbeigeführt hat. Im Falle grob fahrlässiger Herbeiführung des Schadens haftet der Mieter/berechtigte Fahrer in einem seinem Verschulden entsprechenden Verhältnis nach § 81 VVG. Entgegen der Empfehlung des Gesamtverbandes der Versicherungswirtschaft für die Kraftfahrversicherung verzichtet der Vermieter in diesem Fall nicht auf den Einwand grober Fahrlässigkeit. Als grob fahrlässig gilt stets das Führen des Mietwagens unter Ordnungswidrigkeiten- bzw. strafrechtlich relevantem Alkohol-, Medikamenten- oder Drogeneinfluss.",
                                    "2. Der Mieter wird ausdrücklich darauf hingewiesen, dass vorsätzliche Verstöße gegen seine in den Mietbedingungen niedergelegten Pflichten zum vollständigen Entfall der Haftungsreduzierung führen, während grob fahrlässige Verstöße gegen diese Pflichten eine Einschränkung der Haftungsreduzierung in einem der Schwere des Verschuldens entsprechenden Verhältnis nach sich ziehen können.",
                                    "3. Abweichend davon ist der Vermieter an die Vereinbarung zur Haftungsreduzierung gebunden, soweit die Verletzung der Obliegenheit weder für den Eintritt des Schadens noch für die Feststellung oder den Umfang der Leistungspflicht des Vermieters ursächlich ist; dies gilt nicht, wenn eine arglistige Obliegenheitsverletzung vorliegt.",
                                    "4. Der Mieter haftet in vollem Umfang für Schäden, die auf Beschädigung, Verunreinigung oder Zerstörung von Sachen Dritter durch die Ladung (z.B. auslaufende Chemikalien etc.) im Zusammenhang mit der Benutzung des Mietwagens nach diesem Mietvertrag zurückgehen. Diese Schadenshaftung kann ausdrücklich nicht durch den Abschluss einer Haftungsreduzierung gemindert werden.",
                                    "5. Der Mieter haftet in vollem Umfang für Schäden am Mietwagen, die durch unsachgemäße Handhabung von Ladegut entstehen (z.B. durch unsachgemäßes Verstauen der Ladung, ungenügenden Verschluss von Fässern etc.). Die Schadenshaftung kann ausdrücklich nicht durch den Abschluss einer Haftungsreduzierung gemindert werden.",
                                    "6. Der Abschluss einer Haftungsreduzierung erfolgt wirksam nur durch separate Vereinbarung auf der Vorderseite des Vertrages. Telefonische Vereinbarungen einer Haftungsreduzierung sind ausdrücklich nicht möglich. Die wirksam vereinbarte Reduzierung der Haftung gilt bis zum Ablauf der vereinbarten Vertragsdauer.",
                                    "7. Nach einem Unfall-, Brand-, Haarwild-, sonstigen Schaden oder Diebstahl hat der Mieter/Fahrer unabhängig vom Schadensausmaß und einer Selbstverursachung ohne Mitwirkung Dritter unverzüglich am Unfallort die Polizei hinzuzuziehen und schnellstmöglich den Vermieter zu informieren. Ist die Polizei vom Unfallort aus nicht erreichbar, ist der Schaden an der nächstgelegenen Polizeistation anzuzeigen.",
                                    " ",
                                    
                                    {text:"IX. Zahlungsbedingungen",bold:true},
                                    "Der Vermieter kann eine Mietvorauszahlung in Höhe der Miet- und Nebenkosten sowie eine Kaution (Sicherheitsleistung) in Höhe bis zum Zeitwert des Mietwagens verlangen.",
                                    " ",
                                    
                                    {text:"X. Datenschutz",bold:true},
                                    "1. Da wir Fahrzeuge mit Ortungs- und Trackingsystemen einsetzen, weisen wir Sie darauf hin, diese Systeme im Bedarfsfall zur Feststellung des Fahrzeugstandortes einzusetzen. Solche Fälle sind Verdacht auf Diebstahl, verspätete Rückgaben, Anzeichen für Unterschlagung, Unfälle oder Pannen.",
                                    "2. Der Vermieter wird personenbezogene Daten verarbeiten, soweit er aufgrund gesetzlicher Vorschriften dazu verpflichtet ist oder sich das aus berechtigten Interessen im Rahmen der Kfz-Vermietung ergibt. In Bezug auf Ihr Auskunftsrecht und weitere Rechte verweisen wir auf unsere Datenschutzerklärung als Anlage zum Mietvertrag.",
                                    " ",
                                    
                                    {text:"XI. Erfüllungsort und Gerichtsstand",bold:true},
                                    "Erfüllungsort aller Ansprüche aus diesem Vertrag ist der Sitz des auf der Vorderseite dieses Vertrages genannten Vermieters. Ist der Mieter Kaufmann, so ist ausschließlicher Gerichtsstand für alle Rechtsstreitigkeiten das Amts- bzw. Landgericht am Sitz des auf der Vorderseite dieses Vertrages genannten Vermieters.Erfüllungsort aller Ansprüche aus diesem Vertrag ist der Sitz des auf der Vorderseite dieses Vertrages genannten Vermieters. Ist der Mieter Kaufmann, so ist ausschließlicher Gerichtsstand für alle Rechtsstreitigkeiten das Amts- bzw. Landgericht am Sitz des auf der Vorderseite dieses Vertrages genannten Vermieters.",
                                    " ",
                                    
                                    {text:"XII. Sonstiges",bold:true},
                                    "Laut Vorschriften der EU sind wir verpflichtet, Sie auf folgendes hinzuweisen: Die EU stellt eine Plattform zur Online-Streitbeilegung zur Verfügung: https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.show&amp;lng=DE",
                                    " ",
                                    
                                    {text:"XIII. Schlussbemerkungen",bold:true},
                                    "Sollten einzelne Bestimmungen dieses Vertrages ganz oder teilweise nicht wirksam sein oder ihre Wirksamkeit zwischenzeitlich verlieren, so soll hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt werden.",
                                    " ",
                                ]
                            ]
                        },

                        {text: ' ', fontSize:10, bold:true, pageBreak: 'before'},
                        ," "," "," "
                        ," "," "," "," ",
                        {
                            fontSize: 6,
                            columnGap: 10,
                            columns: [
                                [
                                    {text:"IV. Pflichten des Vermieters",bold:true},
                                    "1. Leistungsumfang",
                                    "Der Vermieter überlässt dem Mieter einen technisch intakten und verkehrssicheren Mietwagen inklusive Zubehör und vereinbarter Zusatzleistungen zum Gebrauch ab dem Sitz des Vermieters. Straßengebühren jeglicher Art sind vom Mieter zu tragen. Insoweit hat der Mieter dem Vermieter in voller Höhe freizustellen bzw. kann der Vermieter beim Mieter in voller Höhe Rückgriff nehmen.",
                                    "2. Kfz-Haftpflichtversicherung",
                                    "Die Haftpflicht des Mieters und berechtigter Fahrer ist durch eine Kfz- Haftpflichtversicherung mindestens in dem Umfang gedeckt, der im Zulassungsland des Mietwagens gesetzlich vorgeschrieben oder üblich ist. Die Haftpflichtversicherung ist im Mietpreis des Mietwagens enthalten. In oder auf dem Mietwagen befindliche Sachen sind hierdurch nicht versichert.",
                                    "3. Fahrzeugdefekt",
                                    "a) Wird während der Mietzeit eine Reparatur notwendig, um den Betrieb und/oder die Verkehrssicherheit des Mietwagens zu gewährleisten, so übernimmt der Vermieter die anfallenden Reparaturkosten, wenn der Mieter oder der Fahrer zuvor zumindest das telefonische Einverständnis eingeholt hat und nicht der Mieter nach den Vertragsbedingungen für die Kosten haftet. Diese Verpflichtung besteht nicht bei Bagatellschäden mit zu erwartenden Reparaturkosten bis zu EUR 50,-.",
                                    "b) Bei Versagen des Kilometerzählers ist der Vermieter unverzüglich zu benachrichtigen. Sofern eine Preisvereinbarung in Abhängigkeit von verbrauchten Kilometern vereinbart wurde, darf der Vermieter nach der kartenmäßigen Entfernung abrechnen, sofern eine sofortige Reparatur nicht umsetzbar oder dem Mieter nicht zumutbar ist.",
                                    " ",
                                    
                                    {text:"V. Verhalten des Mieters bei Unfall und/oder Schäden am Mietwagen, Polizeiklausel",bold:true},
                                    "Der Mieter haftet für alle von ihm zu vertretenden rechtlichen, finanziellen und sonstigen Nachteile und Schäden des Vermieters, die nach Übergabe des Mietwagens an den Mieter am und durch den Mietwagen entstehen. Das gilt auch, wenn deren Ursache ein nach der Übergabe des Mietwagens eintretender Mangel der Verkehrssicherheit des Mietwagens ist, es sei denn, dieser wäre auch bei gehöriger Kontrolle nicht festzustellen gewesen. Die Ersatzpflicht des Mieters erstreckt sich auch auf die Wertminderung sowie Gutachter- und Abschleppkosten.",
                                ],
                                [
                                    {text:"XIV. Eigentumsverhältnisse, Halter des Mietgegenstandes und Zulassung",bold:true},
                                    "1. Der Vermieter ist Eigentümer des Mietwagens. Der Vermieter ist berechtigt, in Abstimmung mit dem Mieter den Mietwagen zu besichtigen und auf seinem Zustand zu prüfen.",
                                    "2. Der Mieter darf über den Mietwagen nicht verfügen, insbesondere es weder verkaufen, verpfänden, verschenken, noch zur Sicherung übereignen, Eine Untervermietung des Mietwagens ist ohne schriftliche Einwilligung des Vermieters nicht zulässig.",
                                    "3. Der Mieter hat den Mietwagen von Rechten Dritter freizuhalten. Bei Ansprüche Dritter auf den Mietwagen, einer Entwendung, einer Beschädigung oder einem Verlust ist der Vermieter vom Mieter unverzüglich zu benachrichtigen.",
                                    "4. Nachträgliche Änderungen, zusätzliche An-, Ein und Aufbauten sowie Lackierung und Beschriftungen an dem Fahrzeug sind nicht zulässig.",
                                    " ",
                                    "Bei Unfällen oder sonstigen Schäden sind der Mieter und der Fahrer verpflichtet, unverzüglich die Polizei und den Vermieter zu verständigen, am Unfall/Schadensfall Beteiligte und Zeugen namentlich und mit ladungsfähiger Anschrift zu notieren und keine Schuldanerkenntnisse Dritten gegenüber abzugeben. Notwendige Bergungsmaßnahmen oder Reparaturen werden in jedem Fall vom Vermieter veranlasst. Der Mieter verpflichtet sich, dem Vermieter unverzüglich einen detaillierten Unfallbericht zu erstellen."
                                ]
                            ]
                        },
                    ]
                ]
            }
        ]
        response.header('X-Frame-Options', 'SAMEORIGIN')
        response.response.setHeader('Content-type', 'application/pdf')
        response.implicitEnd = false
        try{
            PDF.create(content, response.response)
        }catch(e){
            console.log(e)
        }
    }

    async getAgreement({response,params,auth}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        book = book.toJSON()        
        let featId = JSON.parse(book.features)
        let features = await Feature.query().whereIn("id",featId).fetch()
        features = features.toJSON()         
        const content = [
            { 
                style:"default",
                columns: [
                    [                        
                        {text:'Haftungsvereinbarung',bold:true,fontSize:12},
                        " ",
                        {text:'zwischen',fontSize:11},
                        " ",
                        {text:'Name: '+book.customer_firstname+' '+book.customer_lastname,bold:true,fontSize:11,marginLeft:40},
                        " ",
                        {text:'Anschrift: '+book.customer_address,bold:true,fontSize:11,marginLeft:40},
                        " ",
                        {text:'PLZ / Stadt: '+book.customer_postcode+'/'+book.customer_city,bold:true,fontSize:11,marginLeft:40},                                                                 
                        {text:"- im Folgenden \"Vermieter\" genannt -",marginLeft:40,fontSize:11},
                        " ",
                        {text:"und",marginLeft:40,fontSize:11},
                        " ",
                        {text:"Premium Sport-Cars GmbH",bold:true,marginLeft:40,fontSize:11},
                        {text:"Ludwig-Erhard-Str. 8",marginLeft:40,fontSize:11},
                        {text:"28197 Bremen",marginLeft:40,fontSize:11},                        
                        {text:"- im Folgenden \"Vermieter\" genannt -",marginLeft:40,fontSize:11},                        
                        " ",
                        {text:"wird folgende Haftungsvereinbarung geschlossen:",fontSize:11},
                        " ",
                        {text:"Der o.g. Mieter haftet unbeschränkt für alle Schäden am durch den Vermieter überlassenem",fontSize:11},
                        {text:"Fahrzeug, die aufgrund von Bedienungsfehlern oder Überbeanspruchung während der Zeit der",fontSize:11},
                        {text:"Überlassung zurückzuführen sind.",fontSize:11},
                        " ",
                        {text:"Pflichten des Mieters gegen Schäden durch Bedienungsfehler und Überbeanspruchung:",fontSize:11},
                        " ",                                                    
                        {text:"-      Der Mieter ist verpflichtet den Motor des überlassenen Fahrzeuges vor der Nutzung",fontSize:11,marginLeft:20},
                        {text:"warmlaufen zu lassen, um Motorschäden zu vermeiden.",fontSize:11,marginLeft:40},                        
                        " ",
                        {text:"Zu Achten: Betriebstemperatur, Getriebetemperatur und Öltemperatur.",marginLeft:40,fontSize:11},                        
                        " ",                                                
                        {text:"-      Kein Kick-Down! Belastung langsam steigern.",marginLeft:20,fontSize:11},                        
                        " ",                                                
                        {text:"-      Der Mieter ist dazu verpflichtet, vor dem Losfahren die Handbremse zu lösen.",marginLeft:20,fontSize:11},                            
                        " ",                                                
                        {text:"-      Der Mieter ist verpflichtet den gesetzlich vorgeschriebenen Mindestabstand eizuhalten, um",marginLeft:20,fontSize:11},
                        {text:"Steinschläge durch das vorausfahrende Fahrzeug zu vermeiden.",marginLeft:40,fontSize:11},                        
                        " ",                        
                        {text:"-      Der Mieter ist verpflichtet reifenschädigendes bremsen zu umgehen, um ein starkes",marginLeft:20,fontSize:11},
                        {text:"abnutzen der Reifen zu vermeiden.",marginLeft:40,fontSize:11},                            
                        " ",                            
                        {text:"-      Der Mieter ist dazu verpflichtet sich an Ruhezeiten in z.B. Wohngebieten zu halten und",marginLeft:20,fontSize:11},
                        {text:"Lärmbelästigungen zu unterlassen.",marginLeft:40,fontSize:11},                            
                        " ",
                        {text:"Im Haftungsfall hat der Mieter folgende Schäden als Gesamtschuldner zu ersetzen:",fontSize:11},
                        {text:"Die Schadenersatzpflicht des Mieters erstreckt sich unabhängig von der vertraglich vereinbarten",fontSize:11},
                        {text:"Selbstbeteiligung auf die gesamten Reparaturkosten zzgl. einer eventuellen Wertminderung oder bei",fontSize:11},
                        {text:"einem Totalschaden des Fahrzeuges auf den Wiederbeschaffungswert des überlassenen Fahrzeuges",fontSize:11},
                        {text:"abzgl. des Restwertes. Weiter haftet der Mieter – soweit angefallen – für Abschleppkosten, Bergung",fontSize:11},
                        {text:"und Rückführung, Sachverständigengebühren und etwaige weitere dem Vermieter entstehende",fontSize:11},
                        {text:"Kosten und Kosten für den Ausfall in Höhe von 80 % der Tagessätze der jeweils gültigen Preisliste",fontSize:11},
                        " ",
                        {text:"Hinweis:",fontSize:9,bold:true},
                        {text:"Unsere Fahrzeuge sind mit GPS-Ortung ausgestattet, wer unberechtigt mit dem Mietfahrzeug ins Ausland fährt, muss damit",fontSize:9},
                        {text:"rechnen, dass das Fahrzeug bei Diebstahlverdacht stillgelegt wird und die Kosten für den entstandenen Aufwand tragen.",fontSize:9},
                        {text:"Auswertung und Analyse von Fahrverhalten und Fahrweise ist Nachvollziehbar!",fontSize:9},
                        " ",
                        " ",                                                
                        {
                            columns:[                                                               
                                {text:"Bremen, den ",fontSize:11}, 
                                {
                                    width: 200,height:3,marginLeft:-45,marginTop:7,
                                    svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                }                                
                            ]
                        },
                        {text:"Unterschrift Mieter",marginLeft:335,fontSize:11}
                    ]
                ]
            }
        ]
        response.header('X-Frame-Options', 'SAMEORIGIN')
        response.response.setHeader('Content-type', 'application/pdf')
        response.implicitEnd = false
        try{
            PDF.create(content, response.response)
        }catch(e){
            console.log(e)
        }
    }

    async getReceiptDeposit({response,params,auth}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        book = book.toJSON()        
        let featId = JSON.parse(book.features)
        let features = await Feature.query().whereIn("id",featId).fetch()
        features = features.toJSON()         
        const content = [
            { 
                style:"default",
                columns: [
                    [                           
                        " ",                
                        {text:'QUITTUNG ÜBER DEN ERHALT DER MIETKAUTION',bold:true,fontSize:14},
                        " ",
                        " ",
                        " ",
                        " ",
                        {
                            table: {
                                
                                headerRows: 1,
                                widths: [ '*','*'],
                                body: [
                                    [ 
                                        { 
                                            text:'Mieter:',
                                            alignment:'left',                                            
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Vermieter:',
                                            alignment:'left',                                                                                        
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        }
                                    ],                                    
                                    [ 
                                        {text: book.customer_firstname+' '+book.customer_lastname,alignment:'left',fontSize:11,border:[false,false,false,false] },
                                        {text: 'Premium Sport-Cars GmbH',alignment:'left',fontSize:11,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: book.customer_address,alignment:'left',fontSize:11,border:[false,false,false,false] },
                                        {text: 'Ludwig-Erhard-Str. 8',alignment:'left',fontSize:11,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: book.customer_postcode+' '+book.customer_city,alignment:'left',fontSize:11,border:[false,false,false,false] },
                                        {text: '28197 Bremen',alignment:'left',fontSize:11,border:[false,false,false,false]}                                        
                                    ],
                                ]
                            }
                        },                        
                        " ",
                        " ",
                        " ",
                        " ",
                        {text:book.car.title.replace(/<[^>]*>?/gm, '')+' - '+book.car.plate,bold:true,fontSize:11},                      
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        {                         
                            table: {
                                headerRows: 1,
                                widths: [ '30%','*' ],
                                body: [                                    
                                    [ 
                                        {text: ' \nGesamt EUR, Cent:',fontSize:11,alignment:'right',bold:true,border:[false,false,false,false]},
                                        {text:'4000',fontSize:24,bold:true,border:[false,false,false,false],alignment:"center",fillColor:"#BFBFBF"}                                                                                
                                    ],
                                    [
                                        {
                                            text:' ',
                                            fontSize:10,
                                            border:[false,false,false,false]
                                        },
                                        {
                                            text:' ',
                                            fontSize:10,
                                            border:[false,false,false,false]
                                        }
                                    ],
                                    [ 
                                        {text: 'EUR in Worten, \nCent wie oben:',alignment:'right',bold:true,fontSize:11,border:[false,false,false,false]},
                                        {text: 'viertausend',alignment:'center',fontSize:24,bold:true, fillColor:"#F2F2F2",border:[false,false,false,false]}                                        
                                    ]                                                                      
                                ]
                            }
                        },
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        {text:"Der Vermieter bestätigt hiermit, dass er die im Mietvertrag vereinbarte Kaution in Höhe",fontSize:10},
                        " ",
                        " ",
                        {text:"von 4000 Euro am "+moment(book.checkin).format("DD.MM.YYYY")+" von dem Mieter per Kreditkarte (here we got 3 options: 1. Bar  2. EC-karte  3. Kreditkarte) erhalten hat.",fontSize:10},
                        " ",
                        " ",
                        " ",
                        " ",                        
                        " ",
                        " ",                        
                        {
                            columns:[                                                                                               
                                [
                                    {
                                        width: 200,height:3,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Ort, Datum",fontSize:11,alignment:'left'},
                                ],
                                [
                                    {
                                        width: 200,height:3,marginRight:10,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Stempel / Unterschrift / Vermieter",fontSize:11,alignment:'left'},
                                ]
                            ]
                        }                                            
                    ]
                ]
            }
        ]
        response.header('X-Frame-Options', 'SAMEORIGIN')
        response.response.setHeader('Content-type', 'application/pdf')
        response.implicitEnd = false
        try{
            PDF.create(content, response.response)
        }catch(e){
            console.log(e)
        }
    }  
    
    async getReceiptDeposit1({response,params,auth}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        book = book.toJSON()        
        let featId = JSON.parse(book.features)
        let features = await Feature.query().whereIn("id",featId).fetch()
        features = features.toJSON()         
        const content = [
            { 
                style:"default",
                columns: [
                    [                           
                        " ",                
                        {text:'QUITTUNG ÜBER DIE RÜCKERHALT DER KAUTION',bold:true,fontSize:14},
                        " ",
                        " ",
                        " ",
                        " ",
                        {
                            table: {
                                
                                headerRows: 1,
                                widths: [ '*','*'],
                                body: [
                                    [ 
                                        { 
                                            text:'Mieter:',
                                            alignment:'left',                                            
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Vermieter:',
                                            alignment:'left',                                                                                        
                                            bold: true, fontSize:11,border:[false,false,false,false] 
                                        }
                                    ],                                    
                                    [ 
                                        {text: book.customer_firstname+' '+book.customer_lastname,alignment:'left',fontSize:11,border:[false,false,false,false] },
                                        {text: 'Premium Sport-Cars GmbH',alignment:'left',fontSize:11,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: book.customer_address,alignment:'left',fontSize:11,border:[false,false,false,false] },
                                        {text: 'Ludwig-Erhard-Str. 8',alignment:'left',fontSize:11,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: book.customer_postcode+' '+book.customer_city,alignment:'left',fontSize:11,border:[false,false,false,false] },
                                        {text: '28197 Bremen',alignment:'left',fontSize:11,border:[false,false,false,false]}                                        
                                    ],
                                ]
                            }
                        },                        
                        " ",
                        " ",
                        " ",
                        " ",
                        {text:book.car.title.replace(/<[^>]*>?/gm, '')+' - '+book.car.plate,bold:true,fontSize:11},                      
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        {                         
                            table: {
                                headerRows: 1,
                                widths: [ '30%','*' ],
                                body: [                                    
                                    [ 
                                        {text: ' \nGesamt EUR, Cent:',fontSize:11,alignment:'right',bold:true,border:[false,false,false,false]},
                                        {text:'2000,00 €',fontSize:24,bold:true,border:[false,false,false,false],alignment:"center",fillColor:"#BFBFBF"}                                                                                
                                    ],
                                    [
                                        {
                                            text:' ',
                                            fontSize:10,
                                            border:[false,false,false,false]
                                        },
                                        {
                                            text:' ',
                                            fontSize:10,
                                            border:[false,false,false,false]
                                        }
                                    ],
                                    [ 
                                        {text: 'EUR in Worten, \nCent wie oben:',alignment:'right',bold:true,fontSize:11,border:[false,false,false,false]},
                                        {text: 'zweitausend',alignment:'center',fontSize:24,bold:true, fillColor:"#F2F2F2",border:[false,false,false,false]}                                        
                                    ]                                                                      
                                ]
                            }
                        },
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        " ",
                        {text:"Der Mieter bestätigt hiermit, dass er die im Mietvertrag vereinbarte Kaution in Höhe",fontSize:10},
                        " ",
                        " ",
                        {text:"von 2000 Euro am "+moment(book.checkin).format("DD.MM.YYYY")+" von dem Vermieter per bar zurückerhalten hat.",fontSize:10},
                        " ",
                        " ",
                        " ",
                        " ",                        
                        " ",
                        " ",                        
                        {
                            columns:[                                                                                               
                                [
                                    {
                                        width: 200,height:3,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Ort, Datum",fontSize:11,alignment:'left'},
                                ],
                                [
                                    {
                                        width: 200,height:3,marginRight:10,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Unterschrift / Mieter",fontSize:11,alignment:'left'},
                                ]
                            ]
                        }                                            
                    ]
                ]
            }
        ]
        response.header('X-Frame-Options', 'SAMEORIGIN')
        response.response.setHeader('Content-type', 'application/pdf')
        response.implicitEnd = false
        try{
            PDF.create(content, response.response)
        }catch(e){
            console.log(e)
        }
    }  

    async getHandOver({response,params,auth}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        book = book.toJSON()        
        let featId = JSON.parse(book.features)
        let features = await Feature.query().whereIn("id",featId).fetch()
        features = features.toJSON()         
        const content = [
            { 
                style:"default",
                columns: [
                    [        
                        " ",
                        " ",                
                        {text:'Übergabeprotokoll',bold:true,fontSize:16},                        
                        {
                            table: {                                
                                headerRows: 1,
                                widths: [ '70%','*'],
                                body: [
                                    [ 
                                        { 
                                            text:'Fahrzeugdaten',
                                            alignment:'left',                                            
                                            bold: true, fontSize:10,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Übergabeinformationen',
                                            alignment:'left',                                                                                        
                                            bold: true, fontSize:10,border:[false,false,false,false] 
                                        }
                                    ],
                                    [ 
                                        {text: 'Kennzeichen:'+' '+book.car.plate,alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Datum Übergabe: 18.05.2021',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Hersteller, Modell, Typ: '+book.car.title.replace(/<[^>]*>?/gm, ''),alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Uhrzeit Übergabe:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Farbe:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Ort der Übergabe:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Kilometerstand:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Kraftstoffart:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                ]
                            }
                        },                                                
                        " ",
                        {
                            table: {                                
                                headerRows: 1,
                                widths: [ '50%','*'],
                                body: [
                                    [ 
                                        { 
                                            text:'Daten des Übergebenden',
                                            alignment:'left',                                            
                                            bold: true, fontSize:10,border:[false,false,false,false],
                                            marginLeft:10 
                                        },
                                        { 
                                            text:'Daten des Übernehmenden',
                                            alignment:'left',                                                                                        
                                            bold: true, fontSize:10,border:[false,false,false,false] 
                                        }
                                    ],
                                    [ 
                                        {text: 'Premium Sport-Cars GmbH',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Name:  '+' '+book.customer_firstname+','+book.customer_lastname,alignment:'left',fontSize:10,border:[false,false,false,false]}
                                        
                                    ],
                                    [ 
                                        {text: 'Ludwig-Erhard-Str. 8',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Firma:  '+book.car.title.replace(/<[^>]*>?/gm, ''),alignment:'left',fontSize:10,border:[false,false,false,false]}                                                             
                                    ],
                                    [ 
                                        {text: '28197 Bremen',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },                                        
                                        {text: 'Straße:  '+book.customer_address,alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'info@premium-sport-cars.de',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'PLZ, Ort:  '+book.customer_postcode+' '+book.customer_city,alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'www.premium-sport-cars.de',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'E-Mail:  '+book.customer_email,alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: '0421 59 66 10 40',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Telefon:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                                                          
                                    ],
                                ]
                            }
                        },   
                        " ",                                               
                        {
                            columns: [
                                {text:"Fahrzeugzustand  außen:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-5},
                                {text:"gewaschen   ", fontSize:10,marginLeft:-5},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"leicht  verschmutzt ", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-80},
                                {text:"stark  verschmutzt ", fontSize:10,marginLeft:-80},
                            ]
                        },
                        {
                            columns: [
                                {text:"Innenraum:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-5},
                                {text:"sauber", fontSize:10,marginLeft:-5},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"leicht  verschmutzt ", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-80},
                                {text:"stark  verschmutzt ", fontSize:10,marginLeft:-80},
                            ]
                        },
                        {
                            columns: [
                                {text:"Tankfüllung:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"leer", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-10},
                                {text:"¼", fontSize:10,marginLeft:-10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"½", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-110},
                                {text:"¾", fontSize:10,marginLeft:-110},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-160},
                                {text:"voll", fontSize:10,marginLeft:-160},
                            ]
                        },
                        " ",
                        {text:"Folgendes wurde übergeben:",fontSize:10,bold:true},
                        {
                            columns: [
                                {text:"Fahrzeugschlüssel",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:35},
                                {text:"ja", fontSize:10,marginLeft:35},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-30},
                                {text:"nein", fontSize:10,marginLeft:-30},
                                {text:"Zulassungsbescheinigung Teil 1", fontSize:10,marginLeft:-70},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:5},
                                {text:"ja", fontSize:10,marginLeft:5},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"nein", fontSize:10,marginLeft:-60},
                            ]
                        },
                        {
                            columns: [
                                {text:"Warndreieck",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"Verhalten im Notfall", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },
                        {
                            columns: [
                                {text:"Warnweste",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"Auto-Ladegerät", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },
                        {
                            columns: [
                                {text:"Verbandkasten",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"USB/Lightning Ladekabel", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },
                        {
                            columns: [
                                {text:"Wagenmappe",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"Shell V-Power Karte", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },                        
                        {text:"sonstiges:________________________________________________________________________________________________",fontSize:10},
                        " ",
                        {text:"Reifen / Felgen",fontSize:10,bold:true},
                        {
                            columns: [
                                {text:"Montierte Reifen:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:20},
                                {text:"Sommerreifen", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:0},
                                {text:"Winterreifen", fontSize:10,marginLeft:0},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:-20},
                                {text:"Ganzjahresreifen", fontSize:10,marginLeft:-20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:-20},
                                {text:"Reserverad", fontSize:10,marginLeft:-20}                                
                            ]
                        },
                        {
                            columns: [                                
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:115},
                                {text:"Alufelgen", fontSize:10,marginLeft:115},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:-57},
                                {text:"Stahlfelgen", fontSize:10,marginLeft:-57}                                
                            ]
                        },
                        {
                            columns: [
                                {text:"Zustand:",fontSize:10},                                
                                {text:"vorne links___mm", fontSize:10,marginLeft:10},                                
                                {text:"vorne rechts___mm", fontSize:10,marginLeft:-5},                                
                                {text:"hinten links___mm", fontSize:10,marginLeft:-10},                                
                                {text:"hinten rechts___mm", fontSize:10,marginLeft:-20}                                
                            ]
                        },
                        " ",                        
                        {text:"Beschädigungen",fontSize:10,bold:true},
                        {text:"(Symbole: R = Riss, D = Delle, F = Fehlteil, K = Kratzer, G = Gebrochen, S = Steinschlag B = Bordsteinbeschädigung)",fontSize:10},
                        " ",
                        {
                            width:360,alignment:'center',
                            image:"public/img/car_dmg/car.png"
                        },
                        " ",
                        {
                            table: {
                                headerRows: 1,
                                widths: [ '*','*' ],
                                body: [
                                    [ 
                                        { 
                                            text:'Innenraum:',
                                            alignment:'center',                                                                                        
                                            fontSize:10,
                                            border:[true,true,true,true] 
                                        },
                                        { 
                                            text:'Art der Beschädigung:',
                                            alignment:'center',                                                                                                                                     
                                            fontSize:10,
                                            border:[true,true,true,true] 
                                        }                                        
                                    ],
                                    [                                        
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]},
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]}
                                    ],
                                    [                                        
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]},
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]}
                                    ]
                                ]
                            }
                        },
                        " ",
                        " ",
                        {text:"Bremen, den "+moment(book.checkin).format("DD.MM.YYYY"),fontSize:11.5},
                        " ",
                        {
                            columns:[                                                                                               
                                [
                                    {
                                        width: 150,height:3,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Ort, Datum",fontSize:10,alignment:'left'},
                                ],
                                [
                                    {
                                        width: 150,height:3,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Unterschrift des Mieters",fontSize:10,alignment:'left'},
                                ],
                                [
                                    {
                                        width: 150,height:3,marginRight:10,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Unterschrift des Vermieters",fontSize:10,alignment:'left'},
                                ]
                            ]
                        }                                          
                    ]
                ]
            }
        ]
        response.header('X-Frame-Options', 'SAMEORIGIN')
        response.response.setHeader('Content-type', 'application/pdf')
        response.implicitEnd = false
        try{
            PDF.create(content, response.response)
        }catch(e){
            console.log(e)
        }
    } 

    async getTakeOver({response,params,auth}){
        let book = await Booking.findOrFail(params.id)
        await book.loadMany(["car","car.mainimg","car.damages","car.kilometers","car.features","car.damages.entries"])
        book = book.toJSON()        
        let featId = JSON.parse(book.features)
        let features = await Feature.query().whereIn("id",featId).fetch()
        features = features.toJSON()         
        const content = [
            { 
                style:"default",
                columns: [
                    [        
                        " ",
                        " ",                
                        {text:'Übernahmeprotokoll ( unter Vorbehalt )',bold:true,fontSize:16},                                                     
                        {
                            table: {                                
                                headerRows: 1,
                                widths: [ '70%','*'],
                                body: [
                                    [ 
                                        { 
                                            text:'Fahrzeugdaten',
                                            alignment:'left',                                            
                                            bold: true, fontSize:10,border:[false,false,false,false] 
                                        },
                                        { 
                                            text:'Übergabeinformationen',
                                            alignment:'left',                                                                                        
                                            bold: true, fontSize:10,border:[false,false,false,false] 
                                        }
                                    ],
                                    [ 
                                        {text: 'Kennzeichen:'+' '+book.car.plate,alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10},
                                        {text: 'Datum Übergabe: 18.05.2021',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Hersteller, Modell, Typ: '+book.car.title.replace(/<[^>]*>?/gm, ''),alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10},
                                        {text: 'Uhrzeit Übergabe:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Farbe:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10},
                                        {text: 'Ort der Übergabe:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Kilometerstand: no auto fill because I need to enter.',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10},
                                        {text: 'Kraftstoffart:',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                ]
                            }
                        },                                                
                        " ",
                        {
                            table: {                                
                                headerRows: 1,
                                widths: [ '60%','*'],
                                body: [
                                    [ 
                                        { 
                                            text:'Daten des Übergebenden',
                                            alignment:'left',                                            
                                            bold: true, fontSize:10,border:[false,false,false,false],
                                            marginLeft:10 
                                        },
                                        { 
                                            text:'Daten des Übernehmenden',
                                            alignment:'left',                                                                                        
                                            bold: true, fontSize:10,border:[false,false,false,false] 
                                        }
                                    ],
                                    [ 
                                        {text: 'Name:'+' '+book.car.plate,alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Premium Sport-Cars GmbH',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Firma:'+book.car.title.replace(/<[^>]*>?/gm, ''),alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'Ludwig-Erhard-Str. 8',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Straße:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: '28197 Bremen',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'PLZ, Ort:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'info@premium-sport-cars.de',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'E-Mail:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: 'www.premium-sport-cars.de',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                    [ 
                                        {text: 'Telefon:',alignment:'left',fontSize:10,border:[false,false,false,false],marginLeft:10 },
                                        {text: '0421 59 66 10 40',alignment:'left',fontSize:10,border:[false,false,false,false]}                                        
                                    ],
                                ]
                            }
                        },   
                        " ",                                               
                        {
                            columns: [
                                {text:"Fahrzeugzustand  außen:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-5},
                                {text:"gewaschen   ", fontSize:10,marginLeft:-5},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"leicht  verschmutzt ", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-80},
                                {text:"stark  verschmutzt ", fontSize:10,marginLeft:-80},
                            ]
                        },
                        {
                            columns: [
                                {text:"Innenraum:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-5},
                                {text:"sauber", fontSize:10,marginLeft:-5},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"leicht  verschmutzt ", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-80},
                                {text:"stark  verschmutzt ", fontSize:10,marginLeft:-80},
                            ]
                        },
                        {
                            columns: [
                                {text:"Tankfüllung:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"leer", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-10},
                                {text:"¼", fontSize:10,marginLeft:-10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"½", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-110},
                                {text:"¾", fontSize:10,marginLeft:-110},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-160},
                                {text:"voll Start: 85%", fontSize:10,marginLeft:-160},
                            ]
                        },
                        " ",
                        {text:"Folgendes wurde übergeben:",fontSize:10,bold:true},
                        {
                            columns: [
                                {text:"Fahrzeugschlüssel",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:35},
                                {text:"ja", fontSize:10,marginLeft:35},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-30},
                                {text:"nein", fontSize:10,marginLeft:-30},
                                {text:"Zulassungsbescheinigung Teil 1", fontSize:10,marginLeft:-70},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:5},
                                {text:"ja", fontSize:10,marginLeft:5},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-60},
                                {text:"nein", fontSize:10,marginLeft:-60},
                            ]
                        },
                        {
                            columns: [
                                {text:"Warndreieck",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"Verhalten im Notfall", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },
                        {
                            columns: [
                                {text:"Warnweste",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"Auto-Ladegerät", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },
                        {
                            columns: [
                                {text:"Verbandkasten",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"USB/Lightning Ladekabel", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },
                        {
                            columns: [
                                {text:"Wagenmappe",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:39},
                                {text:"ja", fontSize:10,marginLeft:39},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-22},
                                {text:"nein", fontSize:10,marginLeft:-22},
                                {text:"Shell V-Power Karte", fontSize:10,marginLeft:-60},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:20},
                                {text:"ja", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:2,marginLeft:-41},
                                {text:"nein", fontSize:10,marginLeft:-41},
                            ]
                        },                        
                        {text:"sonstiges:________________________________________________________________________________________________",fontSize:10},
                        " ",
                        {text:"Reifen / Felgen",fontSize:10,bold:true},
                        {
                            columns: [
                                {text:"Montierte Reifen:",fontSize:10},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:20},
                                {text:"Sommerreifen", fontSize:10,marginLeft:20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:0},
                                {text:"Winterreifen", fontSize:10,marginLeft:0},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:-20},
                                {text:"Ganzjahresreifen", fontSize:10,marginLeft:-20},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:-20},
                                {text:"Reserverad", fontSize:10,marginLeft:-20}                                
                            ]
                        },
                        {
                            columns: [                                
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:115},
                                {text:"Alufelgen", fontSize:10,marginLeft:115},
                                {text:"a", font:"Icons",width:10,fontSize:10,borderRadius:0,marginTop:1,marginLeft:-57},
                                {text:"Stahlfelgen", fontSize:10,marginLeft:-57}                                
                            ]
                        },
                        {
                            columns: [
                                {text:"Zustand:",fontSize:10},                                
                                {text:"vorne links___mm", fontSize:10,marginLeft:10},                                
                                {text:"vorne rechts___mm", fontSize:10,marginLeft:-5},                                
                                {text:"hinten links___mm", fontSize:10,marginLeft:-10},                                
                                {text:"hinten rechts___mm", fontSize:10,marginLeft:-20}                                
                            ]
                        },
                        " ",                        
                        {text:"Beschädigungen",fontSize:10,bold:true},
                        {text:"(Symbole: R = Riss, D = Delle, F = Fehlteil, K = Kratzer, G = Gebrochen, S = Steinschlag B = Bordsteinbeschädigung)",fontSize:10},
                        " ",
                        {
                            width:360,alignment:'center',
                            image:"public/img/car_dmg/car.png"
                        },
                        " ",
                        {
                            table: {
                                headerRows: 1,
                                widths: [ '*','*' ],
                                body: [
                                    [ 
                                        { 
                                            text:'Innenraum:',
                                            alignment:'center',                                                                                        
                                            fontSize:10,
                                            border:[true,true,true,true] 
                                        },
                                        { 
                                            text:'Art der Beschädigung:',
                                            alignment:'center',                                                                                                                                     
                                            fontSize:10,
                                            border:[true,true,true,true] 
                                        }                                        
                                    ],
                                    [                                        
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]},
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]}
                                    ],
                                    [                                        
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]},
                                        {text:" ",fontSize:10, border:[true,true,true,true], borderColor:["#000000","#000000","#000000","#000000"]}
                                    ]
                                ]
                            }
                        },
                        " ",
                        " ",
                        " ",
                        " ",
                        {
                            columns:[                                                                                               
                                [
                                    {
                                        width: 150,height:3,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Ort, Datum",fontSize:10,alignment:'left'},
                                ],
                                [
                                    {
                                        width: 150,height:3,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Unterschrift des Mieters",fontSize:10,alignment:'left'},
                                ],
                                [
                                    {
                                        width: 150,height:3,marginRight:10,
                                        svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#4A4D52" stroke-width="2" /></svg>'
                                    },
                                    " ",
                                    {text:"Unterschrift des Vermieters",fontSize:10,alignment:'left'},
                                ]
                            ]
                        } 
                    ]
                ]
            }
        ]
        response.header('X-Frame-Options', 'SAMEORIGIN')
        response.response.setHeader('Content-type', 'application/pdf')
        response.implicitEnd = false
        try{
            PDF.create(content, response.response)
        }catch(e){
            console.log(e)
        }
    }      
}

module.exports = OrderController
