var allPrices = {};
var defaultMin = 10, defaultMax = 20000, selectedServer, selectedServerInt, selectedPrice;
var svRefundable = [], svRefundWhenCheck = [], svCanRecheck = [];

function getNumber(number) {
  if (parseFloat(number) > parseInt(number)) {
    return parseFloat(number).toFixed(1);
  } else {
    return parseInt(number);
  }
}

function onToggleServerArea(selectedServer) {
  // Toggle area show/hide by server
  $('.server-section').hide();
  $('.' +selectedServer+ '-visible').show();

  $('[data-sv]:not(option)').hide();
  $('option[data-sv]').prop('disabled', true);

  const sv = selectedServer.replace('server_', '');
  $('[data-sv]').each(function() {
    let servers = $(this).attr('data-sv').split(',');
    if (servers.includes(sv)) {
      if ($(this).is('option')) {
        $(this).prop('disabled', false)
      } else {
        $(this).show();
      }
    }
  });

  setTimeout(() => {
    if ($('option[data-sv]').length) {
      $('#formUserAction select').each(function () {
        var $select = $(this);
        if ($select.find(':selected').is(':disabled')) {
          $select.val($select.find('option:not(:disabled)').first().val()).change();
        }
      });
    }
  }, 50);
}

$('#switch_interval_order')['click'](function() {
  const checked = $(this).is(':checked');
  $('#section_interval_order')[checked ? 'show' : 'hide']()
      .find('input').prop('required', checked);

  $('#count').trigger('change');
});

$('[name="total_order"]').change(function() {
  $('#count').trigger('change');
});
