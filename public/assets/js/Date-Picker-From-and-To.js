

$(function(){
    
    let datePicker = document.getElementById('datePickerFrom');
    let picker = new Lightpick({
        field: datePicker,
        onSelect: function(date){
            datePicker.value = date.format('DD.MM.YYYY');
        }
    });
   
});

$(function(){
    
    let datePicker = document.getElementById('datePickerTo');
    let picker = new Lightpick({
        field: datePicker,
        onSelect: function(date){
            datePicker.value = date.format('DD.MM.YYYY');
        }
    });
   
});
