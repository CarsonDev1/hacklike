let allPrices = {};

function selfCalculatorPrice() {
  var count = $('#count').val();

  var total = selectedPrice.price * count;
  total = applyDiscountAndCurrency(total);

  $('#total').val(formatMoney(total, ' VNĐ'));
}

