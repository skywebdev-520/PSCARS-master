import Vue from 'vue'
import VueMaterial from 'vue-material'
import Pickup from '@/components/admin/Pickup'
import Deliver from '@/components/admin/Deliver'
import VueLazyLoad from 'vue-lazyload'
import VueKonva from 'vue-konva'
import VueSignaturePad from 'vue-signature-pad';
import axios from 'axios'
import VueAxios from 'vue-axios'
 
import 'vue-material/dist/vue-material.min.css'



// make sure we can use it in our components

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueLazyLoad)
Vue.use(VueMaterial)
Vue.use(VueSignaturePad);
Vue.use(VueKonva, { prefix: 'Konva'});

if ($("#pickup").length) {
  new Vue({
    el: '#pickup',
    components: { Pickup },
    template: '<Pickup />'
  })
}

if ($("#Deliver").length) {
  window.v_deliver = new Vue(Deliver)
}
