<template>
  <div>
    <HotelDatePicker checkInChanged="checkin" checkOutChanged="checkout" format="DD.MM.YYYY"  :i18n="deDE"></HotelDatePicker>
    <button v-on:click="search" class="btn btn-primary btn-block">Prüfen</button>    
  </div>
</template>

<script>

import HotelDatePicker from 'vue-hotel-datepicker'
import moment from 'moment'
export default {
  name: 'Check',
  components:{HotelDatePicker},
  methods:{
    checkin(sel){
      this.dates = this.dates[sel,this.dates[1]]
    },
    checkout(sel){
      this.dates = this.dates[this.dates[0],sel]
    },
    search(){
      window.location = "/fahrzeuge/"+moment(this.dates[0]).format("YYYY-MM-DD")+"/"+moment(this.dates[1]).format("YYYY-MM-DD")
    }
  },
  data(){return{
    dates: [new Date,new Date],
    deDE:{
      night: 'Tag',
      nights: 'Tage',
      'day-names': ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      'check-in': 'Abholdatum',
      'check-out': 'Abgabe',
      'month-names': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    }
  }}
}
</script>