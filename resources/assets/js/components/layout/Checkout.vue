<template>
  <div class="row">
    <div class="col-12 col-lg-12">
      <div class="jumbtron mb-3 p-md-5">
        <div class="container">
          <div class="row no-gutters">
            <div class="col-md-2">
              <img v-bind:src="'/uploads/'+car.mainimg.id+'.'+car.mainimg.location" class="shadow-lg bg-dark" style="border-radius: 10px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;" />
            </div>
            <div class="col-md-10 pt-2 pl-md-4">
              <div class="">
                <div class="d-flex bd-highlight">
                  <div class="bd-highlight">
                    <h3 class="mb-0" v-html="car.title">{{car.title}}</h3>
                  </div>
                  <div class="ml-auto text-right flex-shrink-1 bd-highlight">
                    <h3 class="mb-0">{{rangeType=='single'?formatCurr(car.priceOneDay):formatCurr(car.price)}} €</h3>
                    <small>inklusive MwSt.</small><br/>
                    <small>pro Tag</small>
                  </div>
                </div>
                <div class="text-dark">{{rangeType=='single'?car.inclKilometers:car.inclKilometers_day}} km inklusive pro Tag</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <div id="timeframe" style="margin-top: -1px;">
        <div class="card" v-if="timeframe">
          <div class="container">
            <div class="card-body d-flex justify-content-between">
              <div>
                <b class="mr-3">Zeitraum:</b><br class="d-md-none" />
                von: {{moment(checkin).format("DD.MM.YYYY")}} {{timeCheckin}} Uhr bis: {{moment(checkout).format("DD.MM.YYYY")}} {{timeCheckout}} Uhr
              </div>
              <div>
                <button v-on:click="timeframe = false" class="btn btn-lg btn-link" style="padding:0" href="#"><i class="far fa-edit"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="jumbotron mb-0" v-if="!timeframe">
          <div class="container">
            <h3 class="text-center mb-0">Zeitraum</h3>

            <h6 class="text-center mb-5" v-if="weekend">Ausgewählt: {{rangeType=="single"?"7 Stunden":"24 Stunden"}}</h6>
            <h6 class="text-center mb-5" v-else>Ausgewählt: {{rangeType=="single"?"8 Stunden":"24 Stunden"}}</h6>
            <div class="card bg-white" style="border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
              <nav class="nav nav-fill nav-justified bg-dark" >                
                <a class="nav-item nav-link active text-white mr-0" v-on:click="rangeType='single'" v-bind:class="{'bg-danger disabled':rangeType=='single'}" href="#">{{weekend==0?"8 Stunden":"7 Stunden"}}</a>
                <a class="nav-item nav-link  text-white mr-0" v-on:click="rangeType='multi'" v-bind:class="{'bg-danger disabled':rangeType=='multi'}" href="#">24 Stunden</a>
              </nav>
              
              <div v-if="checkBlocked()" role="alert" class="alert alert-danger"><small>
                 Der Buchungszeitraum ist leider nicht verfügbar! <br> Es sind bereits Buchungungen getätigt wurden in dem bestimmten Zeitraum. <br>Achten Sie darauf das im gewählten Zeitraum keine Tage blockiert sind! <br>Wochenendbuchungen sind zugelassen solange Abholung und Abgabe innerhalb der Woche liegen.</small>
              </div>
              <div class="card-body" v-if="rangeType=='single'">
                <VueCtkDateTimePicker
                  :auto-close="true"
                  :label="'Abholung'"
                  :formatted="'DD.MM.YYYY'"
                  :format="'YYYY-MM-DD'"
                  :color="'#343a40'"
                  :minDate="moment().subtract(1,'days').toDate()"
                  :no-weekends-days="false"
                  :no-shortcuts="true"
                  :range="false"
                  :onlyDate="true"
                  :no-buttonNow="true"
                  :disabled-dates="disabledDates"
                  start
                  v-model="from"
                />

                <div class="d-flex bd-highlight mt-2">
                  <div class="pr-2 w-50 bd-highlight">
                    <label>Abholung</label>
                    <h3 class="pt-2">{{weekend==1?"10:00 Uhr":"9:00 uhr"}}</h3>                    
                  </div>
                  <div class="pl-2 w-50 flex-shrink-1 bd-highlight">
                    <label>Abgabe</label>
                    <h3 class="pt-2">17:00 Uhr</h3>
                  </div>
                </div>
              </div>
              <div class="card-body" v-if="rangeType=='multi'">
                <VueCtkDateTimePicker
                  :auto-close="true"
                  :label="'Abholung - Abgabe'"
                  :formatted="'DD.MM.YYYY'"
                  :format="'YYYY-MM-DD'"
                  :color="'#343a40'"
                  :minDate="moment().subtract(1,'days').toDate()"
                  :no-weekends-days="false"
                  :no-shortcuts="true"
                  :range="true"
                  :no-buttonNow="true"
                  :disabled-dates="disabledDates"
                  start
                  v-model="fromTo"
                />

                <div class="d-flex bd-highlight mt-2">
                  <div class="pr-2 w-50 bd-highlight">
                    <label>Abholung</label>
                    <select v-model="timeCheckin" class="custom-select">
                      <option value="09:00">09:00 Uhr</option>
                      <option value="10:00">10:00 Uhr</option>
                      <option value="11:00">11:00 Uhr</option>
                      <option value="12:00">12:00 Uhr</option>
                      <option value="13:00">13:00 Uhr</option>
                      <option value="14:00">14:00 Uhr</option>
                      <option value="15:00">15:00 Uhr</option>
                      <option value="16:00">16:00 Uhr</option>
                      <option value="17:00">17:00 Uhr</option>
                    </select>
                  </div>
                  <div class="pl-2 w-50 flex-shrink-1 bd-highlight">
                    <label>Abgabe</label>
                    <h3 class="pt-2">{{timeCheckin}} Uhr</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button v-bind:disabled="checkDates()" v-if="!timeframe" class="btn btn-danger btn-block" v-on:click="timeframe = true">Speichern</button>
      </div>

      <div id="freekilometers" v-if="timeframe != null" style="margin-top: -1px;">
        <div class="card">
          <div class="container">
            <div class="card-body d-flex justify-content-between">
              <div>
                <b class="mr-3">Freikilometer:</b><br class="d-md-none" />
                <span v-if="rangeType=='multi'" >{{~~((CalculatedWeekendDays() * car.inclKilometers_weekend) + ((getDays() - CalculatedWeekendDays()) * car.inclKilometers_day))}} km</span>
                <span v-if="rangeType=='single'" >{{car.inclKilometers * getDays()}} km</span>

              </div>
              <div>
              
              </div>

            </div>
          </div>
        </div>
      </div>

      <div id="kilometers" v-if="timeframe != null" style="margin-top: -1px;">
        <div class="card" v-if="kilometerSel">
          <div class="container">
            <div class="card-body d-flex justify-content-between">
              <div>
                <b class="mr-3">Zusätzliches Kilometer:</b><br class="d-md-none" />
                <span v-if="kilometer!=0">{{getCurrentKil().kilometers}} km</span>
                <span v-if="kilometer==0">Keines ausgewählt</span>
              </div>
              <div>
                <button v-on:click="kilometerSel = !kilometerSel" class="btn btn-lg btn-link" style="padding:0" href="#"><i class="far fa-edit"></i></button>
              </div>

            </div>
          </div>
        </div>
        <div v-if="!kilometerSel" class="jumbotron mb-0" >
          <div class="container">
            <h3 class="text-center mb-5">Zusätzliches Kilometerpaket</h3>

            <div v-on:click="kilometer = 0" >
              <div v-bind:class="{ 'bg-dark text-white': kilometer==0 }" class="card mb-4" style="cursor:pointer;border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
                <div class="row ">
                  <div class="col-md-1 pt-3 pr-0 text-center">
                    <div class="custom-control custom-switch">
                      <input class="custom-control-input" id="kil_0" type="radio" name="kilometer" value="0" v-model="kilometer">
                      <label class="custom-control-label text-dark" for="kil_0">&nbsp;</label>
                    </div>
                  </div>
                  <div class="col-md-11 pl-0">
                    <div class="card-body">
                      <div class="d-flex bd-highlight">
                        <div class="bd-highlight ">
                          <h5 class="mb-0" v-bind:class="{ 'text-white': kilometer==0 }" for="banktransfer" style="text-transform: none;">Keines auswählen </h5>
                        </div>

                        <div class="ml-auto text-right pl-3 flex-shrink-1 bd-highlight">
                          <h5 class="mb-0" v-bind:class="{ 'text-white': kilometer==0 }" for="banktransfer">0,- €</h5>
                        </div>
                      </div>
      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="kil in car.kilometers" v-on:click="kilometer = kil.id" v-bind:key="'kil-'+kil.id">
              <div v-bind:class="{ 'bg-dark text-white': kilometer==kil.id }" class="card mb-4" style="cursor:pointer;border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
                <div class="row ">
                  <div class="col-md-1 pt-4 pr-0 text-center">
                    <div class="custom-control custom-switch">
                      <input class="custom-control-input" v-bind:id="'kil_'+kil.id" type="radio" name="kilometer" v-bind:value="kil.id" v-model="kilometer">
                      <label class="custom-control-label text-dark" v-bind:for="'kil_'+kil.id">&nbsp;</label>
                    </div>
                  </div>
                  <div class="col-md-11 pl-0">
                    <div class="card-body">
                      <div class="d-flex bd-highlight">
                        <div class="bd-highlight ">
                          <h5 class="mb-0" v-bind:class="{ 'text-white': kilometer==kil.id }" for="banktransfer">{{kil.kilometers }} KM </h5>
                          <small>{{kil.description}}</small>
                        </div>

                        <div class="ml-auto text-right pt-1 pl-3 flex-shrink-1 bd-highlight">
                          <h4 class="mb-0" v-bind:class="{ 'text-white': kilometer==kil.id }" for="banktransfer">{{formatCurr(kil.price  )}} €</h4>
                        </div>
                      </div>
      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <button v-if="!kilometerSel"  class="btn btn-danger btn-block" v-on:click="kilometerSel = true">Speichern</button>
      </div>

      <div id="extras" v-if="kilometerSel != null" style="margin-top: -1px;">
        <div class="card" v-if="extrasSel">
          <div class="container">
            <div class="card-body d-flex justify-content-between">
              <div>
                <b class="mr-3">Extras:</b><br class="d-md-none" />
                <span v-for="featu in getfeatures()" v-bind:key="'ft-'+featu.id" class="mr-3">
                  {{featu.title}}
                </span>
                
                <span v-if="getfeatures().length ==0"  class="mr-3">
                  Keine Ausgewählt
                </span>

              </div>
              <div>
                <button v-on:click="extrasSel = !extrasSel" class="btn btn-lg btn-link" style="padding:0" href="#"><i class="far fa-edit"></i></button>
              </div>

            </div>
          </div>
        </div>
        <div v-if="!extrasSel" class="jumbotron mb-0">
          <div class="container">
            <h3 class="text-center mb-5">Extras</h3>


              <div  v-for="feature in car.features"  v-bind:key="feature.id">
                <div v-bind:class="{ 'bg-dark text-white': checkincludes(feature.id) }" class="card mb-4" style="border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
                  <div class="row ">
                    <div class="col-md-1 pt-3 pb-3 pr-0 text-center">
                      <div class="custom-control custom-switch">
                        <input class="custom-control-input" v-bind:id="'feat_'+feature.id" type="checkbox" name="features" v-bind:value="feature.id"  v-model="features">
                        <label class="custom-control-label text-dark" v-bind:for="'feat_'+feature.id">&nbsp;</label>
                      </div>
                    </div>
                    <div class="col-md-11 pl-0 px-4 px-md-0">
                      <div class="">
                        <div class="d-flex bd-highlight">
                          <div class="bd-highlight pt-3 pb-3 ">
                            <h5 class="mb-0" v-bind:class="{ 'text-white': checkincludes(feature.id) }" for="banktransfer">{{feature.title}} </h5>
                          </div>
                        
                          <div class="ml-auto text-right pt-3 pb-3 pr-md-4 pl-3 flex-shrink-1 bd-highlight" v-if="!feature.perday">
                            <h5 class="mb-0" v-bind:class="{ 'text-white': checkincludes(feature.id) }" for="banktransfer">{{formatCurr(feature.price)}} €</h5>
                          </div>

                          <div class="ml-auto pt-2 pb-2 pr-4 text-right pl-3 flex-shrink-1 bd-highlight" v-if="feature.perday">
                            <h5 class="mb-0" v-bind:class="{ 'text-white': checkincludes(feature.id) }" for="banktransfer">{{formatCurr(feature.price)}} €</h5>
                            <small>Pro Tag</small>
                          </div>
                        </div>
        
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <button v-if="!extrasSel" class="btn btn-danger btn-block" v-on:click="extrasSel = true">Speichern</button>
      </div>

      <div id="customer" v-if="extrasSel != null" style="margin-top: -1px;">
        <div class="card" v-if="customerSel">
          <div class="container">
            <div class="card-body d-flex justify-content-between">
              <div>
                <b class="mr-3">Mieter:</b><br class="d-md-none" />
                {{customerFirstname}} {{customerLastname}}, {{customerAddress}} {{customerPostcode}} {{customerCity}}, {{customerEmail}}
              </div>
              <div>
                <button v-on:click="customerSel = !customerSel" class="btn btn-lg btn-link" style="padding:0" href="#"><i class="far fa-edit"></i></button>
              </div>

            </div>
          </div>
        </div>
        <div v-if="!customerSel" class="jumbotron mb-0" >
          <div class="container">
            <h3 class="text-center mb-5">Mieter Informationen</h3>
                  
            <div v-if="checkFields()" class="alert alert-danger mb-0" role="alert">
              <small>Es sind nicht alle mit einen * gekennzeichneten Pflichtfelder ausgefüllt.</small>
            </div>
            <div class="card contactform card-body" style="border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
              <div class="form-group">
                <label>
                  Mietverhältnis
                  <sup class="text-danger">*</sup>
                </label>
                <select v-model="customerType" class="form-control">
                  <option value="privat">Privat</option>
                  <option value="business">Firma</option>
                </select>
              </div>
              <div v-if="customerType=='business'" class="row">
                <div class="col pr-0">
                  <div class="form-group">
                    <label>
                      Firma
                      <sup class="text-danger">*</sup>
                    </label>
                    <input v-model="customerCompany" type="text" class="form-control" placeholder />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>USt-ID</label>
                    <input v-model="customerVAT" type="text" class="form-control" placeholder />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-6 pr-0">
                  <div class="form-group">
                    <label>
                      Vorname
                      <sup class="text-danger">*</sup>
                    </label>
                    <input v-model="customerFirstname" type="text" class="form-control" placeholder />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>
                      Nachname
                      <sup class="text-danger">*</sup>
                    </label>
                    <input v-model="customerLastname" type="text" class="form-control" placeholder />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>
                  Rechnungsadresse
                  <sup class="text-danger">*</sup>
                </label>
                <input v-model="customerAddress" type="text" class="form-control" placeholder />
              </div>
    
              <div class="row">
                <div class="col-12 col-md-3 pr-0">
                  <div class="form-group">
                    <label>
                      Postleitzahl
                      <sup class="text-danger">*</sup>
                    </label>
                    <input v-model="customerPostcode" type="text" class="form-control" placeholder />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>
                      Stadt
                      <sup class="text-danger">*</sup>
                    </label>
                    <input v-model="customerCity" type="text" class="form-control" placeholder />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-6 pr-0">
                  <div class="form-group">
                    <label>
                      E-Mail
                      <sup class="text-danger">*</sup>
                    </label>
                    <input v-model="customerEmail" type="email" class="form-control" placeholder />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>Telefon</label>
                    <input v-model="customerPhone" type="phone" class="form-control" placeholder />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12  pr-0">
                  <div class="form-group">
                    <label>
                      Anmerkungen zur Buchung
                    </label>
                    <textarea v-model="annotation" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                  </div>
                </div>
              </div>
              <small>
                Mit * gekennzeichnete Felder sind Pflichtfelder und werden benötigt um den Fahrer zu definieren und den Rechnungsbeleg zu erstellen. Ihre E-Mail wird verwendet um Ihnen die Buchungsbestätigung, die Rechnung und den Mietvertrag zusenden. Weite Informationen finden Sie in unseren
                <a
                  href="#"
                >Datenschutzbestimmungen</a>.
              </small>
            </div>
          </div>
        </div>
        <button v-if="!customerSel" v-bind:disabled="checkFields()" class="btn btn-danger btn-block" v-on:click="customerSel = true">Speichern</button>
      </div>

      <div id="payment" v-if="customerSel != null" style="margin-top: -1px;">
        <div class="card" v-if="paymentSel">
          <div class="container">
            <div class="card-body d-flex justify-content-between">
              <div>
                <b class="mr-3">Bezahlmethode:</b>
                <span v-if="paymentType=='creditcard'">Kreditkarte</span>
                <span v-if="paymentType=='banktransfer'">Vorkasse</span>
              </div>
              <div>
                <button v-on:click="paymentSel = !paymentSel" class="btn btn-lg btn-link" style="padding:0" href="#"><i class="far fa-edit"></i></button>
              </div>

            </div>
          </div>
        </div>
        <div v-if="!paymentSel" class="jumbotron mb-0" >
          <div class="container">
            <h3 class="text-center mb-5">Bezahlmethode</h3>

            <div v-bind:class="{ 'bg-dark text-white': paymentType=='creditcard' }" class="card mb-4" style="cursor:pointer;border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
              <div class="row ">
                <div class="col-md-1 pt-4 pr-0 text-center">
                  <div class="custom-control custom-switch">
                    <input class="custom-control-input" id="stripe" type="radio" name="paymentType" value="creditcard" v-model="paymentType">
                    <label class="custom-control-label text-dark" for="stripe">&nbsp;</label>
                  </div>
                </div>
                <div class="col-md-11 pl-0">
                  <div class="card-body">
                    <div class="d-flex bd-highlight">
                      <div class="bd-highlight">
                        <h3 class="mb-0" v-on:click="paymentType='creditcard'" v-bind:class="{ 'text-white': paymentType=='creditcard' }" for="creditcard">KREDITKARTE</h3>
                        <small>VISA, Mastercard, AMEX, Discover</small>
                      </div>
                      <div class="ml-auto text-right flex-shrink-1 bd-highlight">
                        <img src="/assets/img/creditcard.png" style="height:48px" />
                      </div>
                    </div>
    
                  </div>
                </div>
              </div>
            </div>
            <div class="card" v-on:click="paymentType='banktransfer'" v-bind:class="{ 'bg-dark text-white': paymentType=='banktransfer' }" style="cursor:pointer;border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
              <div class="row">
                <div class="col-md-1 pt-4 pr-0 text-center">

                    <div class="custom-control custom-switch">
                      <input class="custom-control-input" id="banktransfer" type="radio" name="payment" value="banktransfer" v-model="paymentType">
                      <label class="custom-control-label text-dark" for="banktransfer">&nbsp;</label>
                    </div>
                  
                </div>
                <div class="col-md-11 pl-0">
                  <div class="card-body">
                    <div class="d-flex bd-highlight">
                      <div class="bd-highlight">
                        <h3 class="mb-0" v-bind:class="{ 'text-white': paymentType=='banktransfer' }" for="banktransfer">Vorkasse</h3>
                        <small>Bitte überweisen Sie die Anzahlung innerhalb von 4 Tagen nach erfolgreicher Buchung, ansonsten wir die Reservierung storniert.</small>
                      </div>
                      <div class="ml-auto text-right pl-3 flex-shrink-1 bd-highlight">
                        <img src="/assets/img/bankcheck.png" style="height:48px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <button v-if="!paymentSel" v-bind:disabled="checkFields()" class="btn btn-danger btn-block" v-on:click="paymentSel = true">Speichern</button>
      </div>

      <div v-if="paymentSel!=null" class="container pt-5 pb-5">
        <div class="card" style="overflow: auto;border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
          <div class="card-header">ZUSAMMENFASSUNG</div>
          <table class="table mb-0 table-bordered">
            <tbody>
              <tr>
                <td>
                  <h5 class="mb-0" v-html="car.title">{{car.title}}</h5>
                  <small>VON: {{moment(checkin).format("DD.MM.YYYY")}} {{timeCheckin}} UHR BIS: {{moment(checkout).format("DD.MM.YYYY")}} {{timeCheckout}} UHR</small>
                </td>
                <td v-if="rangeType == 'multi'" >
                  <h5
                    class="mb-0"
                  >{{getDays() }}</h5>
                  <small>{{getDays()>1?"Tage":"Tag"}}</small>
                </td>
                <td v-if="rangeType == 'single'" >
                  <h5
                    class="mb-0"
                  >8</h5>
                  <small>Stunden</small>
                </td>
                <td v-if="rangeType == 'multi'">
                  <h5
                    class="mb-0"
                  >{{formatCurr((CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.priceWeekend) - (CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.price) + (getDays()*car.price) )}} €</h5>
                  <!-- <small>Einzel: {{formatCurr(((CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.priceWeekend) - (CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.price) + (getDays()*car.price) ) / getDays())}} €</small> -->
                </td>
                <td v-if="rangeType == 'single'">
                  <h5
                    class="mb-0"
                  >{{formatCurr(car.priceOneDay)}} €</h5>
                </td>
              </tr>

              <tr v-if="coupon_disabled && rangeType == 'multi'">
                <td class="py-2 text-left" colspan="2">
                  <h6 class="mb-0">
                    {{coupon_description}}<br/>
                    <small class="text-muted">Gutschein</small>
                  </h6>
                </td>
                <td class="py-2" v-if="coupon_type=='percent'">
                  <h5 class="mb-0">-{{formatCurr(((CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.priceWeekend) - (CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.price) + (getDays()*car.price)) /100*coupon_value)}} €</h5>
                </td>
                <td class="py-2" v-if="coupon_type=='direct'">
                  <h5 class="mb-0">-{{formatCurr(((CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.priceWeekend) - (CalculateWeekendDays(moment(checkin+" "+timeCheckin).toDate(),moment(checkout+" "+timeCheckout).toDate())*car.price) + (getDays()*car.price)) - coupon_value)}} €</h5>
                </td>
              </tr>

              <tr v-if="coupon_disabled && rangeType == 'single'">
                <td class="py-2 text-left" colspan="2">
                  <h6 class="mb-0">
                    {{coupon_description}}<br/>
                    <small class="text-muted">Gutschein</small>
                  </h6>
                </td>
                <td class="py-2" v-if="coupon_type=='percent'">
                  <h5 class="mb-0">-{{formatCurr(car.priceOneDay /100*coupon_value)}} €</h5>
                </td>
                <td class="py-2" v-if="coupon_type=='direct'">
                  <h5 class="mb-0">-{{formatCurr(car.priceOneDay - coupon_value)}} €</h5>
                </td>
              </tr>

              <tr v-for="featu in getfeatures()" v-bind:key="'ft-'+featu.id">
                <td class="py-2">
                  <h6 class="mb-0">{{featu.title}}</h6>
                </td>
                <td class="py-2" v-if="featu.perday">
                  <h5 class="mb-0">{{getDays()}} {{getDays()>1?"Tage":"Tag"}}</h5>
                </td>
                <td class="py-2" v-if="!featu.perday">
                  <h5 class="mb-0">1X</h5>
                </td>
                <td class="py-2" v-if="!featu.perday">
                  <h5 class="mb-0">{{formatCurr(featu.price)}} €</h5>
                </td>
                <td class="py-2" v-if="featu.perday">
                  <h5 class="mb-0">{{formatCurr(featu.price*getDays())}} €</h5>
                  <small>Einzel: {{formatCurr(featu.price)}} €</small>
                </td>
              </tr>

              <tr>
                <td class="py-2">
                  <h6 class="mb-0">Inklusive Kilometer</h6>
                </td>
                <td class="py-2">
                  <h5 class="mb-0" v-if="rangeType=='multi'">{{ ~~((CalculatedWeekendDays() * car.inclKilometers_weekend) + ((getDays() - CalculatedWeekendDays()) * car.inclKilometers_day)) }} km</h5>
                  <h5 class="mb-0" v-if="rangeType=='single'">{{car.inclKilometers * getDays()}} km</h5>
                </td>
                <td class="py-2">
                  <h5 class="mb-0">{{formatCurr(0)}} €</h5>
                </td>
              </tr>

              <tr v-if="getKilometer()">
                <td class="py-2">
                  <h6 class="mb-0">Zusätzliches Kilometerpaket</h6>
                </td>
                <td class="py-2">
                  <h5 class="mb-0">{{getKilometer().kilometers}} km</h5>
                </td>
                <td class="py-2">
                  <h5 class="mb-0">{{formatCurr(getKilometer().price)}} €</h5>
                </td>
              </tr>

              <tr>
                <td class="py-2 text-right" colspan="2">
                  <h6 class="mb-0">inkl. MwSt.</h6>
                </td>
                <td class="py-2">
                  <h5 class="mb-0">{{formatCurr(getFullprice() / 119 * 19)}} €</h5>
                </td>
              </tr>
              <tr>
                <td class="py-2 text-right" colspan="2">
                  <h4 class="mb-0">Gesamtsumme</h4>
                </td>
                <td class="py-2">
                  <h4 class="mb-0">{{formatCurr(getFullprice())}} €</h4>
                </td>
              </tr>
              <tr>
                <td class="py-2 text-right" colspan="2">
                  <h6 class="mb-0" style="font-weight:600">ANZAHLUNG {{car.deposit}}%</h6>
                </td>
                <td class="py-2">
                  <h6 class="mb-0">{{formatCurr(getFullprice() /100*car.deposit )}} €</h6>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card mt-3"  style="border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
          <div class="card-body">

            <div class="input-group ">
              <input v-model="coupon_code" v-bind:disabled="coupon_disabled" type="text" class="form-control" placeholder="Gutscheincode" >
              <div class="input-group-append">
                <button v-on:click="checkCoupon" class="btn btn-outline-secondary" type="button" >Prüfen</button>
              </div>
            </div>
            <small v-if="coupon_err" v-bind:disabled="coupon_disabled" class="form-text text-danger">Der eingegebene Gutscheincode existiert nicht</small>
          </div>
        </div>

        <div class="card mt-3"  style="border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
          <div class="card-body text-dark">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="agbs" value="rent" id="rent" />
              <label class="form-check-label" for="rent">
                <small>Ich bin mir bewusst das ich durch das bestätigen der Buchung einen rechtskräftigen Mietvertrag eingehe.</small>
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="agbs" value="agb" id="agb" />
              <label class="form-check-label" for="agb">
                <small>
                  Mit dieser Bestellung erklären Sie sich mit unseren
                  <a href="https://premium-sport-cars.de/agbs/" target="_blank">AGB</a> einverstanden.
                  <a href="https://premium-sport-cars.de/agbs/" target="_blank">Das Widerrufsbestimmungen</a> Sie zur Kenntnis genommen.
                </small>
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="agbs" value="dsvgo" id="dsvgo" />
              <label class="form-check-label" for="dsvgo">
                <small>
                  Ich habe die
                  <a href="https://premium-sport-cars.de/datenschutz/" target="_blank">Datenschutzbestimmungen</a> zur Kenntnis genommen.
                </small>
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="agbs"
                value="newsletter"
                id="newsletter"
              />
              <label class="form-check-label" for="newsletter">
                <small>Ich möchte stätig Informiert werden über neue Angebote. Ich bin mir bewusst das ich jederzeit den Newsletter abbestellen kann.</small>
              </label>
            </div>
          </div>
        </div>

        <div
          v-if="!( agbs.includes('dsvgo') && agbs.includes('agb') && agbs.includes('rent') )"
          class="alert alert-danger"
          role="alert"
        >
          <small>Bitte Akzeptieren Sie unsere AGB's, Datenschutzbestimmungen und die Kenntnisname der akzeptanz des Mietvertrages.</small>
        </div>

        <div class="card mt-3"  style="border-radius: 5px;max-width:100%;box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;">
          <div class="card-header text-center">
            <small>Die Gesamtsumme abzüglich der Anzahlung ist Vorort via EC, Kreditkarte oder Bar Zahlung direkt zu bezahlen.</small>
            <button
              v-on:click="buy"
              class="btn btn-danger btn-block"
              v-bind:disabled="getAllErrors(true).length > 0"
            >Kostenpflichtig buchen</button>
          </div>
        </div>
        <div v-if="getAllErrors().length > 0" class="alert alert-danger" role="alert">
          <small>
            Bitte überprüfen Sie das Formular:
            <br />
            <ul class="mb-0 pb-0 pl-3">
              <li v-bind:key="err" v-for="err in getAllErrors()" v-html="err"> {{err}}</li>
            </ul>
          </small>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import moment from "moment";
import axios from "axios";

var stripe = Stripe('pk_live_jJB0u3WP6FyPmZ9PVHykGxiJ00SkcUmL3l');
function formatCurr(numb) {
  let n = 2;
  let x = 3;
  let s = ".";
  let c = ",";
  var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")",
    num = numb.toFixed(Math.max(0, ~~n));

  return (c ? num.replace(".", c) : num).replace(
    new RegExp(re, "g"),
    "$&" + (s || ",")
  );
}
function CalculateWeekendDays(fromDate, toDate) {
  var weekendDayCount = 0;

  while (fromDate < toDate) {
    if (fromDate.getDay() === 0 || fromDate.getDay() == 6 || fromDate.getDay() == 5) {
      ++weekendDayCount;
    }
    fromDate.setDate(fromDate.getDate() + 1);
  }

  return weekendDayCount;
}

let checkout = {
  name: "Checkout",
  watch: {
    fromTo(val) {
      this.checkin = val["start"];
      this.checkout = val["end"];
    },
    from(val){
      this.checkin =val;
      this.checkout = val;
      this.timeCheckin = "09:00"
      this.timeCheckout = "17:00"
    },
    timeCheckin(val){
      this.timeCheckout = val
    }
  },
  methods: {
    checkDates(){
      if(this.rangeType=="single"){
        if(this.from!=""){
          return false
        }
      }
      if(this.rangeType=="multi"){
        if(this.fromTo.start!="" && this.fromTo.end!=""){
          return false
        }
      }
      return true
    },
    checkincludes(val){
      return this.features.includes(val)
    },
    checkinHandle(sel) {
      this.checkin = sel;
    },
    checkoutHandle(sel) {
      this.checkout = sel;
    },
    getfeatures() {
      return this.car.features.filter(feat => this.features.includes(feat.id));
    },
    getKilometer(){
      return this.car.kilometers.find(el=>el.id==this.kilometer) 
    },
    getCurrentKil(){
      if(this.kilometer == 0 ){
        return {id:0}
      }
      for (const kil in this.car.kilometers) {
        
        if(this.car.kilometers[kil].id == this.kilometer){
          return this.car.kilometers[kil]
        }
      }
    },
    checkBlocked() {
      return this.disabledDates.reduce((res, cur) => {
        if (!res) {
          return moment(cur).isBetween(this.checkin, this.checkout);
        }
        return res;
      }, false);
    },
    getDays(){
      if(this.rangeType=="single"){
        return 1
      }
      return moment(this.checkout + " " + this.timeCheckout).diff(
          moment(this.checkin + " " + this.timeCheckin),
          "days"
      )
    },
    getFullprice(withoutGift) {
      let days = 1
      if(this.rangeType=="multi"){
        this.timeCheckout = this.timeCheckin
        days = moment(this.checkout + " " + this.timeCheckout).diff( moment(this.checkin + " " + this.timeCheckin), "days" )
      }
      let weekendsFull = this.CalculateWeekendDays( moment(this.checkin + " " + this.timeCheckin).toDate(), moment(this.checkout + " " + this.timeCheckout).toDate() ) * this.car.priceWeekend;
      let weekends = weekendsFull - this.CalculateWeekendDays( moment(this.checkin + " " + this.timeCheckin).toDate(), moment(this.checkout + " " + this.timeCheckout).toDate() ) * this.car.price;
      let full = weekends + moment(this.checkout + " " + this.timeCheckout).diff( moment(this.checkin + " " + this.timeCheckin), "days" ) * this.car.price;
      if(this.rangeType == "single"){
        full = this.car.priceOneDay
      }
      if(!withoutGift){
        if(this.coupon_disabled){
          if(this.coupon_type=="percent"){
            if(this.coupon_value == 100 ){
              full= 0
            }else{
              full= full - (full /100*this.coupon_value)
            }
          }else{
            full= full - coupon_value;
          }
        }
      }
      let features = this.car.features.reduce((total, curr) => {
        if (this.features.includes(curr.id)) { 
          if(curr.perday){
            return total + (curr.price*days);
          }
          return total + curr.price;
        } else { return total; }
      }, 0);
      if(this.kilometer != 0 ){
        features = features + this.car.kilometers.find(el=>el.id==this.kilometer).price
      }
      full = full + features;
      
      return full;
      
    },
    checkFields() {
      if (this.customerType == "business" && !this.customerCompany) {
        return true;
      }
      if (
        this.customerFirstname &&
        this.customerLastname &&
        this.customerAddress &&
        this.customerPostcode &&
        this.customerCity &&
        this.customerEmail
      ) {
        return false;
      } else {
        return true;
      }
    },
    getAllErrors(all) {
      let errors = [];
      if (this.checkFields()) {
        errors.push(
          "Es sind nicht alle mit einen * gekennzeichneten Pflichtfelder ausgefüllt."
        );
      }
      if (!this.checkout) {
        errors.push("Bitte wählen Sie ein Abgabe Datum aus!");
      }
      if (moment(this.checkin+" "+this.timeCheckin).isBefore(moment().hour(1))) {
        errors.push("Buchungszeitraum darf nicht vor dem heutigen Tag liegen!");
      }
      if (moment(this.checkout).isBefore(this.checkin)) {
        errors.push("Abgabe Datum darf nicht vor der Abholung liegen!");
      }
      if (this.checkBlocked()) {
        errors.push(
          "Der Buchungszeitraum ist leider nicht verfügbar! <br />Es sind bereits Buchungungen getätigt wurden in dem bestimmten Zeitraum. <br />Achten Sie darauf das im gewählten Zeitraum keine Tage blockiert sind! <br />Wochenendbuchungen sind zugelassen solange Abholung und Abgabe innerhalb der Woche liegen. "
        );
      }

      if (this.paymentType == "sepa" && !this.ibcompleted) {
        errors.push("Bitte geben Sie Ihre IBAN an.");
      }
      if (this.paymentType == "creditcard" && !this.cdcompleted) {
        errors.push("Bitte geben Sie Ihre Kreditkarten daten an.");
      }

      if (all) {
        if (
          !(
            this.agbs.includes("dsvgo") &&
            this.agbs.includes("agb") &&
            this.agbs.includes("rent")
          )
        ) {
          errors.push("agbs");
        }
      }
      return errors;
    },
    async checkCoupon(){
      this.coupon_err=false
      let {data} = await axios.post("/coupon",{code:this.coupon_code})
      if(data.status){
        this.coupon_description = data.coupon.description
        this.coupon_type = data.coupon.type
        this.coupon_id = data.coupon.id
        this.coupon_value = data.coupon.value
        this.coupon_disabled=true
      }else{
        this.coupon_err=true
      }
    },
    async buy() {
      const {annotation,timeCheckin,timeCheckout,features,checkout,checkin,fromTo,from,rangeType,agbs,paymentType,car,customerType,customerCompany,customerVAT,customerFirstname,customerLastname,customerAddress,customerPostcode,customerCity,customerEmail,customerPhone,cdcompleted,coupon_id,coupon_err,coupon_code,coupon_disabled,coupon_description,coupon_type,coupon_value,kilometer} = this
      let {data} = await axios.post("/buchen",{annotation,timeCheckin,timeCheckout,features,checkout,checkin,rangeType,agbs,paymentType,car:car.id,customerType,customerCompany,customerVAT,customerFirstname,customerLastname,customerAddress,customerPostcode,customerCity,customerEmail,customerPhone,cdcompleted,coupon_id,coupon_err,coupon_code,coupon_disabled,coupon_description,coupon_type,coupon_value,kilometer})
      if(this.paymentType=="creditcard"){
        stripe.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: data.id
        }).then(function (result) {
          console.log(result)
        });

      }else{
        window.location.href = data;
      }
    },
    moment,
    formatCurr,
    CalculateWeekendDays,
    CalculatedWeekendDays: function(){
      return CalculateWeekendDays(moment(this.checkin+" "+this.timeCheckin).toDate(),moment(this.checkout+" "+this.timeCheckout).toDate())
    }
  },
  data() {
    return {

      extrasSel:null,
      timeframe:null,
      customerSel:null,
      paymentSel:null,
      kilometerSel:null,
      weekend : window.data.weekend,
      rangeType:"single",

      disabledDates: window.data.blocked,
      fromTo: {
        start:"",
        end: ""
      },
      from:"",
      features: [],
      agbs: [],
      changeDate: true,
      paymentType: "creditcard",
      checkin: moment(new Date())
        .add(3, "days")
        .format("YYYY-MM-DD"),
      checkout: moment(new Date())
        .add(4, "days")
        .format("YYYY-MM-DD"),
      timeCheckin: "09:00",
      timeCheckout: "09:00",
      car: window.data.car,
      customerType: "privat",
      customerCompany: null,
      customerVAT: null,
      customerFirstname: null,
      customerLastname: null,
      customerAddress: null,
      customerPostcode: null,
      customerCity: null,
      customerEmail: null,
      customerPhone: null,
      cdcompleted:true,
      coupon_id:null,
      coupon_err:false,
      coupon_code:"",
      coupon_disabled:false,
      coupon_description:"",
      coupon_type:"percent",
      coupon_value:0,
      kilometer:0,
      annotation:""
    };
  }
};
export default checkout
</script>