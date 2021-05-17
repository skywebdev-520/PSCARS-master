import Vue from 'vue'
import DamageAdd from '@/components/admin/DamageAdd'
import VueKonva from 'vue-konva'
import VueLazyLoad from 'vue-lazyload'

import axios from 'axios'
import VueAxios from 'vue-axios'
   
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueLazyLoad)
Vue.use(VueKonva, { prefix: 'Konva'});

if ($("#DamageAdd").length) {
  new Vue({
    el: '#DamageAdd',
    components: { DamageAdd },
    template: '<DamageAdd />'
  })
}
