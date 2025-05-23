"use strict";

$('#cb_set_time').change(function() {
  var checked = $(this).is(':checked');
  $('#date-send')[checked ? 'show' : 'hide']();
});

$(document).ready(function() {
  $('#date-send').val(moment().add(5, 'minutes').format('DD/MM/YYYY HH:mm'));
  $('#date-send').datetimepicker({
    format: 'DD/MM/YYYY HH:mm',
    locale: 'vi',
    minDate:new Date()
  });
});