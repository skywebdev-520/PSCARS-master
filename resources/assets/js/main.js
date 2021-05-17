import Vue from 'vue'
import Check from '@/components/layout/Check'
import Listing from '@/components/layout/Listing'
import Booking from '@/components/layout/Booking'
import Checkout from '@/components/layout/Checkout'
import Calender from '@/components/layout/Calender'
import VueLazyLoad from 'vue-lazyload'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

// make sure we can use it in our components

Vue.config.productionTip = false
Vue.use(VueLazyLoad)

if ($("#Check").length) {
  new Vue({
    el: '#Check',
    components: { Check },
    template: '<Check />'
  })
}

if ($("#Listing").length) {
  new Vue({
    el: '#Listing',
    components: { Listing },
    template: '<Listing />'
  })
}


if ($("#Booking").length) {
  new Vue({
    el: '#Booking',
    components: { Booking },
    template: '<Booking />'
  })
}


if ($("#Checkout").length) {
  new Vue({
    el: '#Checkout',
    components: { Checkout },
    template: '<Checkout />'
  })
}


if ($("#calender").length) {
  new Vue({
    el: '#calender',
    components: { Calender },
    template: '<Calender />'
  })
}



