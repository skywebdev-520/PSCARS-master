<template>
  <div class="row">
    <div class="col-3">
      <div class="card" style>
        <div class="card-header">VERFÜGBARKEIT</div>
        <div class="card-body">
            <HotelDatePicker checkInChanged="checkin" checkOutChanged="checkout" format="DD.MM.YYYY"  :i18n="deDE"></HotelDatePicker>
        </div>
      </div>

      <div class="card mt-4" style>
        <div class="card-header">HILFE ZENTRUM</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            Vivamus eget nibh. Etiam cursus leo vel metus. Nulla facilisi.
            Aenean nec eros.
          </li>
          <li class="list-group-item">
            <h3 class="mb-0 text-dark">+49 2122 123 20 33</h3>
          </li>
          <li class="list-group-item">info@premium-sport-cars.com</li>
        </ul>
      </div>
    </div>

    <div class="col-9">
      <div class="row">
        <div class="col-4">
          <div class="card">
            <img src="/img/bgL.jpg" class="card-img-top" alt="..." />
            <div class="card-body">
              <div class="d-flex bd-highlight mb-3">
                <div class="p-2 bd-highlight">
                  <h3 class="mb-0">FERRARI X7</h3>
                  <small>Inklusive MwSt.</small>
                </div>
                <div class="ml-auto p-2 text-right flex-shrink-1 bd-highlight">
                  <h3 class="mb-0">30,00 €</h3>
                  <small>pro Stunde</small>
                </div>
              </div>
              <hr />
              <p
                class="card-text"
              >Vivamus eget nibh. Etiam cursus leo vel metus. Nulla facilisi. Aenean nec eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.</p>
            </div>
            <div class="card-footer">
              <a href="/fahrzeuge/1" class="btn btn-primary btn-block">BUCHEN</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import HotelDatePicker from "vue-hotel-datepicker";
import moment from "moment";
export default {
  name: "Check",
  components: { HotelDatePicker },
  methods: {
    checkin(sel) {
      this.dates = this.dates[(sel, this.dates[1])];
    },
    checkout(sel) {
      this.dates = this.dates[(this.dates[0], sel)];
    }
  },
  data() {
    return {
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