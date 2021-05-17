<template>
  <div class="card card-body  shadow h-100">
    <FullCalendar
     defaultView="dayGridMonth"
     :plugins="calendarPlugins" 
     :locale="locale"
     :locales="locales"
     :header="header"
     :events="events"
    />
  </div>
</template>

<style lang='sass'>

    @import '~@fullcalendar/core/main.css';
    @import '~@fullcalendar/daygrid/main.css';
    
</style>
<script>
import moment from "moment";
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'

import deLocale from '@fullcalendar/core/locales/de';

export default {
  name: "Calender",
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  watch: {
  },
  methods: {
    moment
  },
  data() {
    return {
        calendarPlugins: [ dayGridPlugin ],
        locales:[deLocale],
        locale:"de",
        fromTo:"",
        events:window.data.blocked,
        header:{
          center: "dayGridMonth,dayGridWeek,dayGridDay"
        }
    };
  }
};
</script>