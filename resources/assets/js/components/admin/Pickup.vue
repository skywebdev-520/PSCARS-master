<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Fahrzeug abholung</span>
      </md-app-toolbar>

      <md-app-content>
        
        <md-steppers  :md-active-step.sync="active" md-vertical md-linear>
            <md-step id="first" :md-editable="false" md-label="Vertrags Informationen" >
                <div class="md-layout" style="background-color:#fafafa">
                    <div class="md-layout-item md-size-30 md-small-size-100" >
                        <md-card  style="margin-top:20px;margin-bottom:20px" >
                            <md-card-header>
                                <div class="md-title">Kunden Informationen</div>
                            </md-card-header>

                            <md-list>
                                <md-list-item v-if="book.customer_company">
                                    <md-icon class="md-primary">business</md-icon>
                                    <div class="md-list-item-text">
                                        <span>{{book.customer_company}}<br/>{{book.customer_vat}}</span>
                                        <span>Firma</span>
                                    </div>
                                </md-list-item>
                                <md-list-item >
                                    <md-icon class="md-primary">person</md-icon>
                                    <div class="md-list-item-text">
                                        <span>{{book.customer_firstname}} {{book.customer_lastname}}</span>
                                        <span>Name</span>
                                    </div>
                                </md-list-item>
                                <md-list-item >
                                    <md-icon class="md-primary">location_on</md-icon>
                                    <div class="md-list-item-text">
                                        <span>{{book.customer_address}}<br>{{book.customer_postcode}} {{book.customer_city}}</span>
                                        <span>Adresse</span>
                                    </div>
                                </md-list-item>

                                <md-list-item v-if="book.customer_phone">
                                    <md-icon class="md-primary">phone</md-icon>
                                    <div class="md-list-item-text">
                                        <span>{{book.customer_phone}}</span>
                                        <span>Telefonnummer</span>
                                    </div>
                                </md-list-item>
                                <md-list-item >
                                    <md-icon class="md-primary">email</md-icon>
                                    <div class="md-list-item-text">
                                        <span>{{book.customer_email}}</span>
                                        <span>E-Mail</span>
                                    </div>
                                </md-list-item>
                            </md-list>

                        </md-card>
                    </div>
                    <div class="md-layout-item ">
                        <md-card  style="margin-top:20px;margin-bottom:20px;padding-bottom:17px" >
                            <md-card-header>
                                    <div class="md-title">Fahrzeug</div>
                                
                            </md-card-header>
                            <div class="md-layout" >
                                <div class="md-layout-item md-size-20 md-small-size-100">
                                    <img :src="'/uploads/'+ book.car.mainimg.id +'.'+book.car.mainimg.location" alt="People">
                                </div>
                                <div class="md-layout-item " >
                                    <md-list>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.title.replace(/<[^>]*>?/gm, '')}}</span>
                                                <span>Beschreibung</span>
                                            </div>
                                        </md-list-item>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.plate}}</span>
                                                <span>Kennzeichen</span>
                                            </div>
                                        </md-list-item>

                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.vin}}</span>
                                                <span>Fahrgestellnummer</span>
                                            </div>
                                        </md-list-item>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.insurance}}</span>
                                                <span>Versicherung</span>
                                            </div>
                                        </md-list-item>
                                    </md-list>
                                </div>
                                <div class="md-layout-item ">
                                    <md-list>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.location}}</span>
                                                <span>Standort</span>
                                            </div>
                                        </md-list-item>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.kilometer}}</span>
                                                <span>Kilometerstand</span>
                                            </div>
                                        </md-list-item>

                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.ccm}}</span>
                                                <span>ccm<sup>3</sup></span>
                                            </div>
                                        </md-list-item>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.power}}</span>
                                                <span>Motor</span>
                                            </div>
                                        </md-list-item>
                                    </md-list>
                                </div>
                                <div class="md-layout-item ">
                                    <md-list>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.deductible}}</span>
                                                <span>Kaution</span>
                                            </div>
                                        </md-list-item>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.prepayment}}</span>
                                                <span>Selbstbeteiligung</span>
                                            </div>
                                        </md-list-item>

                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.engine}}</span>
                                                <span>Getriebe</span>
                                            </div>
                                        </md-list-item>
                                        <md-list-item >
                                            <div class="md-list-item-text">
                                                <span>{{book.car.petrol}}</span>
                                                <span>Tank</span>
                                            </div>
                                        </md-list-item>
                                    </md-list>
                                </div>
                            </div>
                        </md-card>
                    </div>
                    <div class="md-layout-item md-size-100" >
                        <md-card style="margin-top:20px;margin-bottom:20px" >
                            <md-card-header>
                                <div class="md-title">Buchung</div>
                            </md-card-header>
                            <md-card-content>
                                <h3>von {{moment(book.checkin,'YYYY-MM-DD').format("DD.MM.YYYY")}} {{book.checkin_time}} Uhr bis {{moment(book.checkout,'YYYY-MM-DD').format("DD.MM.YYYY")}} {{book.checkout_time}} Uhr</h3>
                            </md-card-content>
                        </md-card>
                    </div>
                </div>
                <md-button style="margin-top:20px" class="md-raised md-primary" @click="setDone('first', 'perso')">Weiter</md-button>
            </md-step>

            <md-step id="perso" :md-editable="false" md-label="Personalausweis">
                
                <div class="md-layout" style="background-color:#fafafa;padding-top:20px;padding-bottom:20px">
                    <div class="md-layout-item">
                        <md-card>
                            <md-card-header>
                                <md-card-header-text>
                                    <div class="md-title">Personalausweis</div>
                                    <div class="md-subhead">Mieter</div>
                                </md-card-header-text>
                            </md-card-header>
                            <md-card-content>
                                <md-field>
                                    <label>Vorderseite</label>
                                    <md-file v-on:change="selectFile('perso_front_file')" ref="perso_front_file" v-model="perso_front" placeholder="Vorderseite" />
                                </md-field>
                                <md-field>
                                    <label>Rückseite</label>
                                    <md-file v-on:change="selectFile('perso_back_file')" ref="perso_back_file" v-model="perso_back" placeholder="Rückseite" />
                                </md-field>
                            </md-card-content>
                        </md-card>
                    </div>
                    <div class="md-layout-item">
                        <md-card>
                            <md-card-header>
                                <md-card-header-text>
                                    <div class="md-title">Führerschein</div>
                                    <div class="md-subhead">Mieter</div>
                                </md-card-header-text>
                            </md-card-header>
                            <md-card-content>
                                <md-field >
                                    <label>Führerschein Nr.</label>
                                    <md-input v-model="license_nr" />
                                </md-field>
                                <md-field >
                                    <label>Ausstellungsdatum</label>
                                    <md-input v-model="license_date" />
                                </md-field>
                                <md-field >
                                    <label>Fahrerlaubnisklassen</label>
                                    <md-input v-model="license_class" />
                                </md-field>
                                <md-field>
                                    <label>Vorderseite</label>
                                    <md-file v-on:change="selectFile('license_front_file')" ref="license_front_file" v-model="license_front" placeholder="Vorderseite" />
                                </md-field>
                                <md-field>
                                    <label>Rückseite</label>
                                    <md-file v-on:change="selectFile('license_back_file')" ref="license_back_file" v-model="license_back" placeholder="Rückseite" />
                                </md-field>
                            </md-card-content>
                        </md-card>
                    </div>
                </div>
                <div class="md-layout" style="background-color:#fafafa;padding-top:20px;padding-bottom:20px">
                    <div class="md-layout-item">
                        <md-card>
                            <md-card-header>
                                <md-card-header-text>
                                    <div class="md-title">Personalausweis</div>
                                    <div class="md-subhead">2. Mieter</div>
                                </md-card-header-text>
                            </md-card-header>
                            <md-card-content>
                                <md-field >
                                    <label>Vor- und Nachname</label>
                                    <md-input v-model="mieter2" />
                                </md-field>
                                <md-field>
                                    <label>Vorderseite</label>
                                    <md-file v-on:change="selectFile('perso_2_front_file')" ref="perso_2_front_file" v-model="perso_2_front" placeholder="Vorderseite" />
                                </md-field>
                                <md-field>
                                    <label>Rückseite</label>
                                    <md-file v-on:change="selectFile('perso_2_back_file')" ref="perso_2_back_file" v-model="perso_2_back" placeholder="Rückseite" />
                                </md-field>
                            </md-card-content>
                        </md-card>
                    </div>
                    <div class="md-layout-item">
                        <md-card>
                            <md-card-header>
                                <md-card-header-text>
                                    <div class="md-title">Führerschein</div>
                                    <div class="md-subhead">2. Mieter</div>
                                </md-card-header-text>
                            </md-card-header>
                            <md-card-content>
                                <md-field>
                                    <label>Vorderseite</label>
                                    <md-file v-on:change="selectFile('license_2_front_file')" ref="license_2_front_file" v-model="license_2_front" placeholder="Vorderseite" />
                                </md-field>
                                <md-field>
                                    <label>Rückseite</label>
                                    <md-file v-on:change="selectFile('license_2_back_file')" ref="license_2_back_file" v-model="license_2_back" placeholder="Rückseite" />
                                </md-field>
                            </md-card-content>
                        </md-card>
                    </div>
                </div>
                <md-progress-bar v-if="perso_loading" book="book" md-mode="indeterminate"></md-progress-bar>
                <md-button class="md-raised md-primary" @click="uploadDocs()">Weiter</md-button>
            </md-step>

            <md-step id="second" :md-editable="false" md-label="Bezahlung">
                <div class="md-layout" style="background-color:#fafafa">
                    <div class="md-layout-item " >
                        <md-list>
                            <md-list-item >
                                <md-icon class="md-primary" style="color:#00ce00">check_circle</md-icon>
                                <div class="md-list-item-text">
                                    <span>{{formatCurr(book.price_prepayment)}} €</span>
                                    <b>Anzahlung</b>
                                </div>
                            </md-list-item>
                            <md-list-item >
                                <md-icon class="md-primary" style="color:#ce0000">remove_circle_outline</md-icon>
                                <div class="md-list-item-text">
                                    <span>{{formatCurr(book.price_total-book.price_prepayment)}} €</span>
                                    <b>Noch offen</b>
                                </div>
                            </md-list-item>
                            <md-list-item >
                                <md-icon class="md-primary" style="color:#ce0000">remove_circle_outline</md-icon>
                                <div class="md-list-item-text">
                                    <span>{{book.car.prepayment}}</span>
                                    <b>Kaution</b>
                                </div>
                            </md-list-item>
                        </md-list>
                    </div>
                </div>
                <md-button class="md-raised md-primary" @click="setPayed()">Als bezahlt makiert</md-button>
            </md-step>

            <md-step id="dmgs" :md-editable="false" md-label="Schäden">
                <div class="md-layout" style="background-color:#fafafa;padding-top:20px;padding-bottom:20px">
                    <div class="md-layout-item " >
                        <md-table md-card v-for="dmg in book.car.damages" :key="dmg.id">

                            <md-table-row v-for="dmgE in dmg.entries" :key="dmgE.id">
                                <md-table-cell>
                                    <div
                                    v-bind:style="{ background: 'url(/img/car_dmg/'+dmgE.type+'.png) 0% 0% / cover',height:94+'px',width:'200px'}" 
                                    >
                                    <img :src="dmgE.mark" style="width:200px" />
                                    </div>
                                </md-table-cell>
                                <md-table-cell>
                                    <img v-if="dmgE.image" :src="'/uploads/'+dmgE.image" style="height:94px" />
                                </md-table-cell>
                                <md-table-cell>{{dmgE.description}}</md-table-cell>
                            </md-table-row>

                        </md-table>
                    </div>
                </div>
                <md-button class="md-raised md-primary" @click="setDone('dmgs', 'vier')">Weiter</md-button>
            </md-step>

            <md-step id="third" :md-editable="false" md-label="Schaden Erfassung"  style="background-color:#fafafa">
                <md-card v-for="(item, index) in dmgs" :key="'ind_'+index" style="margin-bottom:10px">
                    <div class="md-layout">
                        <div class="md-layout-item" style="border-right:2px solid #ddd;max-width:450px;">
                            <div
                            v-bind:style="{ background: 'url(/img/car_dmg/'+item.cartype+'.png) 0% 0% / cover',height:215+'px'}" 
                            
                            >
                                <Konva-stage :config="configKonva" :ref="'stage_'+index" >
                                    <Konva-layer :ref="'layer_'+index">
                                    </Konva-layer>
                                </Konva-stage>
                            </div>
                            <div  style="padding-left:20px">
                                <md-field >
                                    <label for="cartype">Fahrzeugtyp</label>
                                    <md-select v-model="item.cartype" name="cartype" id="cartype">
                                        <md-option value="familienwagen">Familienwagen</md-option>
                                        <md-option value="kombi">Kombi</md-option>
                                        <md-option value="limousine">Limousine</md-option>
                                        <md-option value="sportwagen">Sportwagen</md-option>
                                        <md-option value="sportwagen_2">Super Sportwagen</md-option>
                                        <md-option value="suv">SUV</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                        </div>
                        <div class="md-layout-item" >
                            <md-card-content>
                                <div style="padding-left:0" class="md-title">Neuer Schaden</div>
                                <md-field>
                                    <label>Bilder</label>
                                    <md-file v-model="item.imgs" placeholder="Bilder vom Schaden" />
                                </md-field>
                                <md-field style="margin-bottom:0">
                                    <label>Beschreibung</label>
                                    <md-textarea  v-model="item.description"></md-textarea>
                                </md-field>
                            </md-card-content>
                        </div>
                    </div>
                    <md-card-actions>
                        <md-button @click="resDmg(index)">Zurücksetzen</md-button>
                        <md-button class="md-accent" @click="delDmg(index)">Löschen</md-button>
                    </md-card-actions>
                </md-card>  
                <div style="text-align:right">
                    <md-button @click="addDmg()" class="md-raised">Schaden hinzufügen</md-button>
                </div>
                <md-button class="md-raised md-primary" @click="setDone('third', 'vier')">Weiter</md-button>
            </md-step>

            <md-step id="vier" :md-editable="false" md-label="Kilometerstand">
                
                <md-field>
                    <label>Derzeitiger Kilometerstand</label>
                    <md-input v-model="kilometers" type="number"></md-input>
                </md-field>
                <md-button class="md-raised md-primary" @click="setkilometer()">Weiter</md-button>
            </md-step>

            <md-step id="fuenf" :md-editable="false" md-label="Unterschrift">

                <vue-pdfjs v-if="active=='fuenf'" :url="'/admin/orders/'+book.id+'/contract?'+active" :type="0"></vue-pdfjs>
                <div class="md-layout">
                    <div class="md-layout-item" style="max-width:500px;padding-right:20px">

                        <md-field >
                            <label style="padding-left:10px">Unterschrift Vermieter</label>
                            <VueSignaturePad
                            width="500px"
                            height="200px"
                            style="border:2px dotted #ddd"
                            ref="signaturePad"
                            />
                        </md-field>
                        <md-button class="md-raised" @click="clearSig()">Löschen</md-button>
                    </div>
                    <div class="md-layout-item" style="max-width:500px;padding-left:20px">
                        <md-field style="border-bottom:none" >
                            <label style="padding-left:10px">Unterschrift Mieter</label>
                            <VueSignaturePad
                            width="500px"
                            height="200px"
                            style="border:2px dotted #ddd"
                            ref="signaturePadCustomer"
                            />
                        </md-field>
                        <md-button class="md-raised" @click="clearSigCust()">Löschen</md-button>
                    </div>
                </div>

                <md-button @click="saveData()" class="md-raised md-primary" style="margin-top:20px;width:100%">Abschließen und Fahrzeug abgeben</md-button>
            </md-step>

        </md-steppers>
      </md-app-content>
    </md-app>
  </div>
</template>


<script>
import moment from "moment";
import {Circle} from "Konva";
import vuePdfjs from 'vue-pdfjs'

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
function getRelativePointerPosition(node) {
    var transform = node.getAbsoluteTransform().copy();
    transform.invert();
    var pos = node.getStage().getPointerPosition();
    return transform.point(pos);
}
export default {
  name: "Pickup",
  components: {
    vuePdfjs
  },
  watch: {
  },
  methods: {
      setDone (id, index) {
        this[id] = true

        this.secondStepError = null

        if (index) {
          this.active = index
        }
      },
      async addDmg(){

        const newIndex = this.dmgs.length 
        this.dmgs.push({
                saved:false,
                marker:"",
                imgs:[],
                description:"",
                cartype: "familienwagen"
        })
        await this.$nextTick()
        const stage = this.$refs["stage_"+newIndex][0].getNode();
        const layer = this.$refs["layer_"+newIndex][0].getNode();
    
        stage.on('click', function() {
            var pos = getRelativePointerPosition(layer);
            var shape = new Circle({
                x: pos.x,
                y: pos.y,
                fill: 'red',
                radius: 20
            });

            layer.add(shape);
            layer.batchDraw();
        });
        
      },
      resDmg(ind){
          this.dmgs[ind] = { saved:false, marker:"", imgs:[], description:"", cartype: "familienwagen" };
          const ndmgs = [...this.dmgs]
          this.dmgs = ndmgs
      },
      delDmg(ind){
          this.dmgs = this.dmgs.splice(ind, 1);
      },
      clearSigCust(){
           this.$refs.signaturePadCustomer.clearSignature()
      },
      clearSig(){
           this.$refs.signaturePad.clearSignature()
      },
      saveData(){
        this.save_loading = true
        this.axios.post('/admin/orders/'+this.book.id+"/pickup/save",
        {
            isDelivered: true,
            isSigned: true,
            signature: this.$refs.signaturePad.saveSignature().data,
            signature_customer: this.$refs.signaturePadCustomer.saveSignature().data
        })
        .then(()=>{
            this.save_loading = false
            window.location = "/admin/orders/"+this.book.id
        })
        .catch((e)=>{
            this.save_loading = false
        });
      },
      uploadDocs(){
            this.perso_loading = true
            
            let formData = new FormData();

            formData.append('license_class',this.license_class)
            formData.append('license_date',this.license_date)
            formData.append('perso_front_file',this.perso_front_file)
            formData.append('perso_back_file',this.perso_back_file)
            formData.append('license_front_file',this.license_front_file)
            formData.append('license_back_file',this.license_back_file)
            formData.append('perso_2_front_file',this.perso_2_front_file)
            formData.append('perso_2_back_file',this.perso_2_back_file)
            formData.append('license_2_front_file',this.license_2_front_file)
            formData.append('license_2_back_file',this.license_2_back_file)
            formData.append('license_class',this.license_class)
            formData.append('license_nr',this.license_nr)
            formData.append('license_date',this.license_date)
            formData.append('mieter2',this.mieter2)
            
            
            this.axios.post('/admin/orders/'+this.book.id+"/pickup/docs",
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(()=>{
              this.perso_loading = false
              this.setDone ("perso", "second")
            })
            .catch((e)=>{
              this.perso_loading = false
            });
      },
      setkilometer(){
        this.kilometer_loading =true
        this.axios.post('/admin/orders/'+this.book.id+"/pickup/kilometer",{kilometer:this.kilometers})
        .then(()=>{
            this.kilometer_loading = false
            this.setDone ("vier", "fuenf")
        })
        .catch((e)=>{
            this.kilometer_loading = false
        });
      },
      setPayed(){
        this.payment_loading =true
        this.axios.post('/admin/orders/'+this.book.id+"/pickup/payment",{isPaid:true})
        .then(()=>{
            this.payment_loading = false
            this.setDone ("second", "dmgs")
        })
        .catch((e)=>{
            this.payment_loading = false
        });
      },
      selectFile(field){
        this[field] = this.$refs[field].$refs.inputFile.files[0] 
      },
      formatCurr,
      moment
  },
  mounted() {
  },
  data() {
    return {
        active: 'first',
        first: false,
        second: false,
        third: false,
        vier: false,
        fuenf: false,
        book: window.data.book,
        configKonva: {
            width: 450,
            height: 215
        },
        dmgs:[
            {
                saved:false,
                marker:"",
                imgs:[],
                description:"",
                cartype: "familienwagen"
            }
        ],

        perso_front_file:null,
        perso_back_file:null,
        license_front_file:null,
        license_back_file:null,
        perso_2_front_file:null,
        perso_2_back_file:null,
        license_2_front_file:null,
        license_2_back_file:null,

        perso_loading:false,

        payment_loading:false,
        kilometer_loading:false,

        perso_front:"",
        perso_back:"",
        license_front:"",
        license_back:"",
        license_class:"",
        license_nr:"",
        license_date:"",
        mieter2:"",
        perso_2_front:"",
        perso_2_back:"",
        license_2_front:"",
        license_2_back:"",

        kilometers: window.data.book.car.kilometer
    };
  }
};
</script>