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
                <md-button style="margin-top:20px" class="md-raised md-primary" @click="setDone('first', 'dmgs')">Weiter</md-button>
            </md-step>


            <md-step id="dmgs" :md-editable="false" md-label="Schäden">
                <div class="md-layout" style="background-color:#fafafa;padding-top:20px;padding-bottom:20px">
                        <div class="md-layout-item md-size-30 md-small-size-100" >
                        <DmgAdd :book="book" />
                        </div>
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
                <md-button class="md-raised md-primary" @click="setDone('dmgs', 'second')">Weiter</md-button>
            </md-step>


            <md-step id="second" :md-editable="false" md-label="Bezahlung">
                <div class="md-layout" style="background-color:#fafafa">
                    <div class="md-layout-item " >
                        <md-list>
                            <md-list-item >
                                <md-icon class="md-primary" style="color:#00ce00">check_circle</md-icon>
                                <div class="md-list-item-text">
                                    <span>{{formatCurr(book.price_total)}} €</span>
                                    <b>Gesamtsumme</b>
                                </div>
                            </md-list-item>
                            <md-list-item >
                                <md-icon class="md-primary" style="color:#ce0000">remove_circle_outline</md-icon>
                                <div class="md-list-item-text">
                                    <span>{{book.car.prepayment}}</span>
                                    <b>Kaution rückzahlen</b>
                                </div>
                            </md-list-item>
                        </md-list>
                    </div>
                </div>
                <md-button class="md-raised md-primary" @click="setDone ('second', 'vier')">Als bezahlt makiert</md-button>
            </md-step>

            <md-step id="vier" :md-editable="false" md-label="Kilometerstand">
                
                <md-field>
                    <label>Derzeitiger Kilometerstand</label>
                    <md-input v-model="kilometers" type="number"></md-input>
                </md-field>
                <md-button class="md-raised md-primary" @click="setkilometer()">Abschließen</md-button>
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
import DmgAdd from './DamageAddDeliver'

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
    el: '#Deliver',
  name: "Deliver",
  components: {
    vuePdfjs,
    DmgAdd
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
      setkilometer(){
        this.kilometer_loading =true
        this.axios.post('/admin/orders/'+this.book.id+"/deliver/kilometer",{kilometer:this.kilometers})
        .then(()=>{
            this.kilometer_loading = false
            window.location = "/admin/orders/"+this.book.id
        })
        .catch((e)=>{
            this.kilometer_loading = false
        });
        
      },
      dmgRefresh(){
          this.axios.get("/admin/damages/book/"+this.book.id)
          .then(result=>{
              this.book.car.damages = result.data
          })
          .catch(()=>{

          })
        
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


        payment_loading:false,
        kilometer_loading:false,

        kilometers: window.data.book.car.kilometer
    };
  }
};


</script>