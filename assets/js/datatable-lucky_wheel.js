let allPrizes = [], prizeWon, userInfo = {};
let theWheel, wheelSpinning = false, useSound = true;
let msgOutOfSpin = 'Bạn đã hết lượt quay, hãy nạp tiền >= 500k để được thêm một lượt quay!';
let spinning = false;

$('#the_wheel').hide();

let audio = new Audio('/assets/sounds/tick.mp3');

function playSound()
{
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function createWheel() {
  if (allPrizes.length === 0) return swalError('Không lấy được danh sách giải thưởng, vui lòng tải lại trang');

  shuffleArray(allPrizes);

  if (theWheel) theWheel.clearCanvas();

  theWheel = new Winwheel({
    'numSegments'       : allPrizes.length,                // Specify number of segments.
    'outerRadius'       : 200,              // Set outer radius so wheel fits inside the background.
    'drawText'          : true,             // Code drawn text can be used with segment images.
    'textFontSize'      : 15,               // Set text options as desired.
    'textOrientation'   : 'curved',
    'textAlignment'     : 'inner',
    'textMargin'        : 90,
    'textFontFamily'    : 'quicksand',
    'textStrokeStyle'   : 'white',
    'textLineWidth'     : 1,
    'textFillStyle'     : 'crimson',
    imageOverlay: true,
    'drawMode'          : 'segmentImage',    // Must be segmentImage to draw wheel using one image per segemnt.
    'segments'          : allPrizes,                   // Define segments including image and text.
    'animation' :           // Specify the animation to use.
      {
        'type'     : 'spinToStop',
        'duration' : 7,
        'spins'    : allPrizes.length,
        'callbackFinished' : onSpinCompleted,
        'callbackSound'    : playSound,   // Called when the tick sound is to be played.
        'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound.
      },
    'pins' :                // Turn pins on.
      {
        'number'     : allPrizes.length,
        // 'fillStyle'  : 'silver',
        'outerRadius': 0,
      }
  });

  function drawTriangle() {
    // Get the canvas context the wheel uses.
    let ctx = theWheel.ctx;

    ctx.strokeStyle = 'navy';  // Set line colour.
    ctx.fillStyle   = 'aqua';  // Set fill colour.
    ctx.lineWidth   = 2;
    ctx.beginPath();           // Begin path.
    ctx.moveTo(170, 5);        // Move to initial position.
    ctx.lineTo(230, 5);        // Draw lines to make the shape.
    ctx.lineTo(200, 40);
    ctx.lineTo(171, 5);
    ctx.stroke();              // Complete the path by stroking (draw lines).
    ctx.fill();                // Then fill.
  }

  drawTriangle();
}

$('#spin_type').change(() => {
  createWheel();
});

// Called when the animation as finished.
function onSpinCompleted(wonPrize) {
  console.log(wonPrize)
  spinning = false;

  let audioOnFinish = new Audio('/assets/sounds/tada.mp3');
  audioOnFinish.play().then();

  let title = 'Bạn đã trúng', note;
  if (wonPrize.prize_type === 'item') {
    note = 'Hãy liên hệ admin để nhận!';
  } else if (wonPrize.prize_type === 'money') {
    note = `Số tiền ${formatMoney(wonPrize.money)}₫ đã được cộng vào tài khoản của bạn!`;
  } else {
    // wishing
    title = 'Chúc bạn may mắn lần sau!';
    note = wonPrize.details || '';
  }

  swal.fire({
    icon: 'success',
    title,
    html:
      `
      <div>
        <div class="prize-name">${wonPrize.name}</div>
        <img class="prize_image" alt="" src="${wonPrize.image}" />
        <div class="prize-note">${note}</div>
      </div>
      `
  }).then(() => {
    wheelSpinning = false;
    resetWheel();
  });

  fetchUserInfo().then();
}

$('#btn_spin').click(() => {
  if (spinning) return false;

  fetchUserInfo()
    .then(info => {
      // Check spin left
      if (info.spin_count <= 0) {
        return swalError(msgOutOfSpin);
      }

      spinning = true;
      // Send spin request
      callAjaxPost('/lucky_wheel/spin').then(function (response) {
        if (!response.status) {
          spinning = false;
          return swalError(response.msg == 'outOfSpin' ? msgOutOfSpin :  response.msg);
        }

        let prizeWonId = response.prize_id;
        // Set the result and then start spin
        let foundIndex = allPrizes.findIndex(prize => prize.id === prizeWonId);

        if (foundIndex === -1) return swalError('Lỗi khi quay thưởng, hãy báo admin!');

        theWheel.animation.stopAngle = theWheel.getRandomForSegment(foundIndex + 1);
        theWheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
      })
    });
});

$('#btn_reset').click(() => {
  resetWheel();
});

function resetWheel() {
  if (!wheelSpinning) {
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
  }
}

$(document).ready(function() {
  callAjaxPost('/lucky_wheel/prizes').then(function(response) {
    allPrizes = response.data;

    // preload images for spin
    let existedImages = [];
    allPrizes.forEach((prize, index) => {
      allPrizes[index].image = prize.image_url;
      allPrizes[index].text = prize.name;
      if (prize.image_url && prize.image_url.length > 5 && !existedImages.includes(prize.image_url)) {
        existedImages.push(prize.image_url);
        $('#image_hidden').append(`<img src='${prize.image_url}' alt=''>`);
      }
    });

    $('#spin_count').text(response.spin_count);

    // Load the spin after 2 seconds
    setTimeout(function() {
      $('#the_wheel').show();
      $('#loading_wheel').hide();
      createWheel();
    }, 1000);
  });
});

function fetchUserInfo() {
  return callAjaxPost('/lucky_wheel/user_info').then(function(response) {
    userInfo = response.data;

    $('#user_balance').html(formatMoney(userInfo.balance));
    $('#spin_count').html(userInfo.spin_count);

    return userInfo;
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

$('.nav-link[href="#tab_2"]').click(function() {
  let prizeTypes = {
    money: 'Tiền',
    item: 'Vật phẩm',
    wishing: 'Lời chúc'
  };

  if (datatableLog) {
    reloadTable();
  } else {
  }
});
