"use strict";

var datatableCard, dateFormat = 'YYYY-MM-DD';

$('.open-crypto-tab').click(function(e) {
  e.preventDefault();

  $('.payment-widget[data-target="crypto"]').trigger('click');
});

if (!$('.list-banks .nav-link.active').length) {
  $('.list-banks .nav-link').first().click();
}
