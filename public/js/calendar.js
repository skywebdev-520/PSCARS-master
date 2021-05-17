document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('kalendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'dayGrid' ]
    });

    calendar.render();
  });