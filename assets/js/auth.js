$('.auto-lowercase').keyup(function() {
  $(this).val($(this).val().toLowerCase());
});

$("#frmAuth").submit(async function(e) {
  e.preventDefault();

  window.location.href = '/';
});

$('.btn-register').click(function() {
  window.location.href = '/register';
});

if ($('#password_register').length) {
// check password
  $(document).on("focus", "#password_register", function () {
    $(this).prop('type', 'text');
    $('.check-password').addClass('active');
    $('.re-check-password').removeClass('active');
  });

  $(document).on("blur", "#password_register", function () {
    $('.check-password').removeClass('active');
    $('#password_register').prop('type', 'password')
  });

  $(document).on("keyup", "#password_register", function () {
    let userName;
    if($('#user_register').val() != undefined) userName = $('#user_register').val().toLowerCase();

    let passwordRegister = $('#password_register').val().toLowerCase();

    if (passwordRegister.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`\\|\-=\'\"])/)){
      $('#character_password').removeClass('invalid');
      $('#character_password').addClass('valid');
    } else {
      $('#character_password').removeClass('valid');
      $('#character_password').addClass('invalid');
    }

    if (passwordRegister.length >=8){
      $('#length_password').removeClass('invalid');
      $('#length_password').addClass('valid');
    } else {
      $('#length_password').removeClass('valid');
      $('#length_password').addClass('invalid');
    }

    if (passwordRegister.includes(userName.toLowerCase())){
      $('#likeUser_password').removeClass('valid');
      $('#likeUser_password').addClass('invalid');
    }
    else {
      $('#likeUser_password').removeClass('invalid');
      $('#likeUser_password').addClass('valid');
    }
  });

// check re-enter the password
  $(document).on("focus","#re_password_register", function () {
    $(this).prop('type', 'text');
    $('.re-check-password').removeClass('active');
  });

  $(document).on("blur", "#re_password_register", function () {
    $(this).prop('type', 'password');
    let password = $('#password_register').val();
    let rePassword = $('#re_password_register').val();

    if (!(password == rePassword)){
      $('.re-check-password').addClass('active');
    }
  });
}

$('[name="phone"]').change(function() {
  let value = $(this).val();
  value = value.toString().replace(/\s/g, '');

  if (value.match(/^84/)) value = value.replace(/^84/, '0');

  value = value.replace(/[-+]/g, '');

  $(this).val(value);
});

$('.login-form [name="username"]').change(function() {
  let value = $(this).val();
  value = value.toString().replace(/\s/g, '');

  if (value.match(/^\+?84/)) value = value.replace(/^\+?84/, '0');

  $(this).val(value);
});
