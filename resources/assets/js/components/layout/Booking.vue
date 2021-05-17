<template>
</template>


<script>
import moment from "moment";

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
export default {
  name: "Check",
  watch: {
    fromTo(val) {

      this.checkin = val["start"];
      this.checkout = val["end"];
    }
  },
  methods: {
    checkinHandle(sel) {
      this.checkin = sel;
    },
    checkoutHandle(sel) {
      this.checkout = sel;
    },
    checkBlocked() {
      return this.disabledDates.reduce((res, cur) => {
        if (!res) {
          return moment(cur).isBetween(this.checkin, this.checkout);
        }
        return res;
      }, false);
    },
    checkoutlink(){
      window.location = "/buchen/"+this.car.id+"/"+this.checkin+"/"+this.checkout+"/"+this.timeCheckin+"/"+this.timeCheckout
    },
    formatCurr,
    moment
  },
  data() {
    let fromTo = null
    console.log(window.data.checkout)
    if(window.data.checkout != "undefined"){
      fromTo = {start:window.data.checkin,end:window.data.checkout}
    }
    return {
      car: window.data.car,
      fromTo,
      disabledDates: window.data.blocked,
      checkin: window.data.checkin,
      checkout: window.data.checkout,
      timeCheckin: "08:00",
      timeCheckout: "08:00",
      dates: [new Date(), new Date()],
      deDE: {
        night: "Tag",
        nights: "Tage",
        "day-names": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
        "check-in": "Abholdatum",
        "check-out": "Abgabe",
        "month-names": [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember"
        ]
      }
    };
  }
};
</script>