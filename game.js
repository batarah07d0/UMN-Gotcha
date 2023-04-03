// Konfigurasi hewan
const hewan = {
  nama: "Default",
  level: 1,
  avatar: 0,
};

const act = {
  // I = Jumlah naik saat aktivitas dilakukan
  // II = Jumlah naik saat aktivitas dilakukan, di increment ini saat naik level
  // D = Jumlah turun saat aktivitas tidak dilakukan
  // DI = Jumlah turun saat aktivitas tidak dilakukan, di increment ini saat naik level
  makan: 50,
  makanI: 10,
  makanII: 5,
  makanD: 5,
  makanDI: 2,

  tidur: 50,
  tidurI: 10,
  tidurII: 5,
  tidurD: 2,
  tidurDI: 3,

  main: 50,
  mainI: 10,
  mainII: 5,
  mainD: 10,
  mainDI: 5,

  obat: 50,
  obatI: 6,
  obatII: 5,
  obatD: 6,
  obatDI: 2,
};

const xp = {
  xp: 0, // xp saat mulai
  xpI: 1, // xp naik berapa per detik
  xpLevelUp: 90, // xp diperlukan untuk naik lvl
  xpIncrement: 60, // xpLevelUp ditambah ini tiap naik level
};

let deathState = false;
let makanState = false;
let tidurState = false;
let mainState = false;
let obatState = false;
let deathFlag = false;

let wakeUpState = false;
let wakeUpFlag = false;

// Simulasi jam
let day = 1;
let hour = 8;
let minutes = 0;
setInterval(function () {
  if(!deathState){
    if (!tidurState) minutes += 5;
    else minutes += 15;

    if (minutes >= 60) {
      minutes = minutes - 60;
      hour++;
      if (hour == 19) {
        $("#backgroundImage").attr("style", "background-image: url('assets/bgforestnight.jpg'); height: 53em");
        notify("Selamat malam " + hewan.nama + "!");
      } else if (hour == 15) {
        $("#backgroundImage").attr("style", "background-image: url('assets/bgforestevening.jpg'); height: 53em");
        notify("Selamat sore " + hewan.nama + "!");
      } else if (hour == 12) {
        $("#backgroundImage").attr("style", "background-image: url('assets/bgforestday.jpg'); height: 53em");
        notify("Selamat siang " + hewan.nama + "!");
      } else if (hour == 5) {
        $("#backgroundImage").attr("style", "background-image: url('assets/bgforestevening.jpg'); height: 53em");
        notify("Selamat pagi " + hewan.nama + "!");
      }
    }
    if (hour >= 24) {
      hour = 0;
      day++;
      notify("Sekarang hari ke" + day + "..");
    }
    if (minutes < 10) printMinutes = minutes.toString().padStart(2, "0");
    else printMinutes = minutes.toString();
    if (hour < 10) printHour = hour.toString().padStart(2, "0");
    else printHour = hour.toString();

    document.getElementById("hourDisplay").innerHTML = "Jam " + printHour + ":" + printMinutes;
  }
}, 1000);

// simulasi aktivitas
setInterval(function () {
    makanActivity();
    tidurActivity();
    obatActivity();
    mainActivity();
    progressBarColor();
  if(!deathState){
    checkIfHewanDied();
    if (hewan.level < 3) xpCalculate();
  }
}, 1000);

// Function hitung
function xpCalculate() {
  xp.xp += xp.xpI;
  if (xp.xp >= xp.xpLevelUp) {
    xp.xp = 0;
    xp.xpLevelUp += xp.xpIncrement;
    hewan.level++;
    hewanCalculateStats();
  }
}
function hewanCalculateStats() {
  if (hewan.level == 1) {
    $("#levelDisplay").text("Bayi");
  } else if (hewan.level == 2) {
    act.makanI += act.makanII;
    act.makanD += act.makanDI;
    act.tidurI += act.tidurII;
    act.tidurD += act.tidurDI;
    act.mainI += act.mainII;
    act.mainD += act.mainDI;
    act.obatI += act.obatII;
    act.obatD += act.obatDI;
    notify(hewan.nama + " naik level menjadi Remaja!");
    $("#levelDisplay").text("Remaja");
  } else if (hewan.level == 3) {
    act.makanI += act.makanII;
    act.makanD += act.makanDI;
    act.tidurI += act.tidurII;
    act.tidurD += act.tidurDI;
    act.mainI += act.mainII;
    act.mainD += act.mainDI;
    act.obatI += act.obatII;
    act.obatD += act.obatDI;
    notify(hewan.nama + " naik level menjadi Dewasa!");
    $("#levelDisplay").text("Dewasa");
  }
}
function checkIfHewanDied() {
  if(act.obat <= 0 && !deathFlag){
    exitGameBermain();
    deathState = true;
    deathFlag = true;
    act.makan = act.main = act.tidur = 0;
    redrawAvatar();
    redrawButtons();
    notify(hewan.nama + " telah mati!");
    setTimeout(function(){
      $("#displayAvatar").hide();
      $("#gameOverCard").show();
      $("#gameOverNama").text(hewan.nama);
      let gameOverAvatar;
      switch(hewan.avatar){
        case 0: gameOverAvatar = "Styracosaurus"; break;
        case 1: gameOverAvatar = "Carnotaurus"; break;
        case 2: gameOverAvatar = "Baryonyx"; break;
      }
      $("#gameOverAvatar").text(gameOverAvatar);
      let gameOverLevel;
      switch(hewan.level){
        case 1: gameOverLevel = "Bayi"; break;
        case 2: gameOverLevel = "Remaja"; break;
        case 3: gameOverLevel = "Dewasa"; break;
      }
      $("#gameOverLevel").text(gameOverLevel);
      $("#gameOverDay").text(day);
    }, 2000);
  }
}

// Tombol Aktivitas & Aktivitas
$("#buttonMakan, #buttonTidur, #buttonMain, #buttonObat").click(function (){
  if(!tidurState){
    wakeUpState = false;
  }
});

$("#buttonMakan").click(function () {
  if (makanState) {
    makanState = false;
  } else {
    tidurState = mainState = obatState = false;
    makanState = true;
  }
  redrawButtons();
  redrawAvatar();
});
$("#buttonTidur").click(function () {
  if (tidurState) {
    tidurState = false;
  } else {
    wakeUpFlag = false;
    makanState = mainState = obatState = false;
    tidurState = true;
  }
  redrawButtons();
  redrawAvatar();
});
$("#buttonMain").click(function () {
  if (mainState) {
    mainState = false;
  } else {
    makanState = tidurState = obatState = false;
    mainState = true;
  }

  redrawButtons();
  redrawAvatar();

  if (mainState && act.makan <= 25){
    notify(hewan.nama + " sedang lapar! Tidak bisa bermain.");
  }else if(mainState){
    startGameBermain();
  }else{
    exitGameBermain();
  }
});
$("#buttonObat").click(function () {
  if (obatState) {
    obatState = false;
  } else {
    makanState = mainState = tidurState = false;
    obatState = true;
  }
  redrawButtons();
  redrawAvatar();
});
function makanActivity() {
  if (makanState && act.makan <= 100) {
    act.makan += act.makanI;
    $("#makanIcon").attr("style", "height: 1.5em;");
  } else if (!makanState && act.makan > 0 && isGameOn){
    act.makan -= act.makanD;
    $("#makanIcon").attr("style", "height: 1.5em; filter: invert(29%) sepia(82%) saturate(4347%) hue-rotate(348deg) brightness(88%) contrast(86%);");
  } else if (!makanState && act.makan > 0){
    act.makan -= 1;
    $("#makanIcon").attr("style", "height: 1.5em;");
  }
  $("#progressBarMakan")
    .children()
    .attr("style", "width: " + (100 * act.makan) / 100 + "%");
}
function tidurActivity() {
  if (tidurState && act.tidur <= 100) {
    act.tidur += act.tidurI;
    $("#tidurIcon").attr("style", "height: 1.5em;");
  } else if (!tidurState && act.tidur > 0 && isGameOn) {
    act.tidur -= act.tidurD;
    $("#tidurIcon").attr("style", "height: 1.5em; filter: invert(29%) sepia(82%) saturate(4347%) hue-rotate(348deg) brightness(88%) contrast(86%);");
  } else if (!tidurState && act.tidur > 0) {
    act.tidur -= 1;
    $("#tidurIcon").attr("style", "height: 1.5em;");
  }

  
  if(act.tidur >= 100 && !wakeUpState && !wakeUpFlag){
    tidurState = false;
    wakeUpState = true;
    wakeUpFlag = true;
    redrawButtons();
    redrawAvatar();
  }else if(act.tidur < 100){
    wakeUpState = false;
    wakeUpFlag = false;
  }

  $("#progressBarTidur")
    .children()
    .attr("style", "width: " + (100 * act.tidur) / 100 + "%");
}
function mainActivity(){
    if(mainState && act.main <= 100){
        // act.main += act.mainI;
    }else if(!mainState && act.main > 0){
        act.main -= 0.5;  
    }
    $("#progressBarMain").children().attr("style", "width: " + ((100 * act.main) / 100) + "%");
}
function obatActivity() {
  if (obatState && act.obat <= 100) {
    act.obat += act.obatI;
    $("#obatIcon").attr("style", "height: 1.3em; ");
  } else if (!obatState && act.obat > 0 && act.makan <= 50 && act.tidur <= 50){
    act.obat -= act.obatD;
    $("#obatIcon").attr("style", "height: 1.3em; filter: invert(29%) sepia(82%) saturate(4347%) hue-rotate(348deg) brightness(88%) contrast(86%);");
  }else{
    $("#obatIcon").attr("style", "height: 1.3em; ");
  }
  $("#progressBarObat")
    .children()
    .attr("style", "width: " + (100 * act.obat) / 100 + "%");
}

// Display
function progressBarColor() {
  barMakan = $("#progressBarMakan").children();
  if (act.makan <= 25) {
    if (makanState) barMakan.attr("class", "progress-bar bg-danger progress-bar-striped progress-bar-animated");
    else barMakan.attr("class", "progress-bar bg-danger");
  } else if (act.makan <= 50) {
    if (makanState) barMakan.attr("class", "progress-bar bg-warning progress-bar-striped progress-bar-animated");
    else barMakan.attr("class", "progress-bar bg-warning");
  } else {
    if (makanState) barMakan.attr("class", "progress-bar bg-success progress-bar-striped progress-bar-animated");
    else barMakan.attr("class", "progress-bar bg-success");
  }

  barTidur = $("#progressBarTidur").children();
  if (act.tidur <= 25) {
    if (tidurState) barTidur.attr("class", "progress-bar bg-danger progress-bar-striped progress-bar-animated");
    else barTidur.attr("class", "progress-bar bg-danger");
  } else if (act.tidur <= 50) {
    if (tidurState) barTidur.attr("class", "progress-bar bg-warning progress-bar-striped progress-bar-animated");
    else barTidur.attr("class", "progress-bar bg-warning");
  } else {
    if (tidurState) barTidur.attr("class", "progress-bar bg-success progress-bar-striped progress-bar-animated");
    else barTidur.attr("class", "progress-bar bg-success");
  }

  barMain = $("#progressBarMain").children();
  if (act.main <= 25) {
    if (mainState) barMain.attr("class", "progress-bar bg-danger progress-bar-striped progress-bar-animated");
    else barMain.attr("class", "progress-bar bg-danger");
  } else if (act.main <= 50) {
    if (mainState) barMain.attr("class", "progress-bar bg-warning progress-bar-striped progress-bar-animated");
    else barMain.attr("class", "progress-bar bg-warning");
  } else {
    if (mainState) barMain.attr("class", "progress-bar bg-success progress-bar-striped progress-bar-animated");
    else barMain.attr("class", "progress-bar bg-success");
  }

  barObat = $("#progressBarObat").children();
  if (act.obat <= 25) {
    if (obatState) barObat.attr("class", "progress-bar bg-danger progress-bar-striped progress-bar-animated");
    else barObat.attr("class", "progress-bar bg-danger");
  } else if (act.obat <= 50) {
    if (obatState) barObat.attr("class", "progress-bar bg-warning progress-bar-striped progress-bar-animated");
    else barObat.attr("class", "progress-bar bg-warning");
  } else {
    if (obatState) barObat.attr("class", "progress-bar bg-success progress-bar-striped progress-bar-animated");
    else barObat.attr("class", "progress-bar bg-success");
  }
}
function redrawButtons() {
  if (!makanState) $("#buttonMakan").attr("class", "btn btn-info");
  else $("#buttonMakan").attr("class", "btn btn-success");
  if (!tidurState) $("#buttonTidur").attr("class", "btn btn-info");
  else $("#buttonTidur").attr("class", "btn btn-success");
  if (!mainState) $("#buttonMain").attr("class", "btn btn-info");
  else $("#buttonMain").attr("class", "btn btn-success");
  if (!obatState) $("#buttonObat").attr("class", "btn btn-info");
  else $("#buttonObat").attr("class", "btn btn-success");

  if(deathState){
    $("#buttonMakan").attr("class", "btn btn-info disabled");
    $("#buttonTidur").attr("class", "btn btn-info disabled");
    $("#buttonMain").attr("class", "btn btn-info disabled");
    $("#buttonObat").attr("class", "btn btn-info disabled");
  }
}
function redrawAvatar(){
  console.log(wakeUpState);
  if (document.contains(document.getElementById("displayAvatar"))) {
    document.getElementById("displayAvatar").remove();
  }

  let avatarHeight;
  switch (hewan.level) {
    case 1:
      avatarHeight = 18;
      break;
    case 2:
      avatarHeight = 23;
      break;
    case 3:
      avatarHeight = 28;
      break;
  }

  switch (hewan.avatar) {
    case 0:
      if(wakeUpState){$("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 9 + '" autoplay="autoplay"><source src="assets/avatars/Styracosaurus/wakeup.webm" type="video/webm" /></video>');}
      else if (deathState) $("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 9 + '" autoplay="autoplay"><source src="assets/avatars/Styracosaurus/death.webm" type="video/webm" /></video>');
      else if (!makanState && !tidurState && !mainState && !obatState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Styracosaurus/idle.gif" style="height: ' + avatarHeight + 'em;">');
      else if (makanState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Styracosaurus/eat.gif" style="height: ' + avatarHeight + 'em;">');
      else if (tidurState) $("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 10 + '" autoplay="autoplay"><source src="assets/avatars/Styracosaurus/death.webm" type="video/webm" /></video>');
      else if (mainState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Styracosaurus/cry.gif" style="height: ' + avatarHeight + 'em;">');
      else if (obatState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Styracosaurus/EatingDrugs.gif" style="height: ' + avatarHeight + 'em;">');
      break;
    case 1:
      if(wakeUpState){$("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 13 + '" autoplay="autoplay"><source src="assets/avatars/Carnotaurus/wakeup.webm" type="video/webm" /></video>');}
      else if (deathState) $("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 15 + '" autoplay="autoplay"><source src="assets/avatars/Carnotaurus/death.webm" type="video/webm" /></video>');
      else if (!makanState && !tidurState && !mainState && !obatState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Carnotaurus/idle.gif" style="height: ' + avatarHeight + 'em;">');
      else if (makanState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Carnotaurus/eat.gif" style="height: ' + avatarHeight + 'em;">');
      else if (tidurState) $("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 13 + '" autoplay="autoplay"><source src="assets/avatars/Carnotaurus/death.webm" type="video/webm" /></video>');
      else if (mainState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Carnotaurus/cry.gif" style="height: ' + avatarHeight + 'em;">');
      else if (obatState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Carnotaurus/eatingDrugs.gif" style="height: ' + avatarHeight + 'em;">');
      break;
    case 2:
      if(wakeUpState){$("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 9 + '" autoplay="autoplay"><source src="assets/avatars/Baryonyx/wakeup.webm" type="video/webm" /></video>');}
      else if (deathState) $("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 9 + '" autoplay="autoplay"><source src="assets/avatars/Baryonyx/death.webm" type="video/webm" /></video>');
      else if (!makanState && !tidurState && !mainState && !obatState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Baryonyx/idle.gif" style="height: ' + avatarHeight + 'em;">');
      else if (makanState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Baryonyx/eat.gif" style="height: ' + avatarHeight + 'em;">');
      else if (tidurState) $("#displayAvatarContainer").append('<video id="displayAvatar" height="' + avatarHeight * 10 + '" autoplay="autoplay"><source src="assets/avatars/Baryonyx/death.webm" type="video/webm" /></video>');
      else if (mainState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Baryonyx/cry.gif" style="height: ' + avatarHeight + 'em;">');
      else if (obatState) $("#displayAvatarContainer").append('<img id="displayAvatar" class="p-5" src="assets/avatars/Baryonyx/EatingDrugs.gif" style="height: ' + avatarHeight + 'em;">');
      break;
  }
}
function notify(message) {
  $("#displayNotifications").text(message);
}

// Saat mulai
hewan.nama = namaHewan;
hewan.avatar = avatarSelectIndex;
progressBarColor();
redrawAvatar();
notify("Selamat datang " + hewan.nama + "!");

// Bermain
const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

let speed = 7;
let tileCount = 20;
let tileSize = canvas.clientWidth/tileCount-2;
let ySpeed = 0;
let xSpeed = 0;
let headX = 10;
let headY = 10;
let starX = 5;
let starY = 5;
let isGameOver = false;
let isGameOn = false;
let starCountdown = 8;
let starTaken = false;
let randImg = 0;

function startGameBermain(){
    randImg = (Math.floor(Math.random() * (3 - 1 + 1) + 1)) - 1;
    speed = 3;
    tileCount = 20;
    tileSize = (canvas.clientWidth/tileCount-2) * 10;
    ySpeed = 0;
    xSpeed = 0;
    headX = 10;
    headY = 10;
    starX = 5;
    starY = 5;
    isGameOver = false;
    isGameOn = true;
    starCountdown = 8;
    $("#activityButtonsCard").hide();
    $("#displayAvatarContainer").hide();
    $("#gameControlsCard").show();
    $("#grid").show();
    drawGame();
}
function exitGameBermain(){
    if(!deathState){
      notify(hewan.nama + " berhenti bermain");
    }

    if(act.makan <= 25){
      notify(hewan.nama + " berhenti bermain.. Dia terlalu lapar.");
    }

    isGameOn = false;
    $("#activityButtonsCard").show();
    $("#displayAvatarContainer").show();
    $("#gameControlsCard").hide();
    $("#grid").hide();
    redrawAvatar();
}

function checkGameOver(){
    if(ySpeed === 0 && xSpeed === 0){
        return false;
    }

    if(headX < 0 || headY < 0 || headX === tileCount || headY === tileCount) 
        isGameOver = true;

    if(isGameOver){
        ctx.fillStyle = "black";
        ctx.font="50px verdana";
        ctx.fillText("Game Over! ", canvas.clientWidth/6.5, canvas.clientHeight/2);
    }

    return isGameOver;
}

function clearGrid(){
    var imgBG = new Image();
    switch(randImg){
      case 0: imgBG.src = "assets/bggamegrass.png"; break;
      case 1: imgBG.src = "assets/bggamegrass2.png"; break;
      case 2: imgBG.src = "assets/bggamedirt.png"; break;
    }
    ctx.fillStyle = ctx.createPattern(imgBG, 'repeat');
    ctx.fillRect(0, 0, (canvas.clientWidth * 2), canvas.clientHeight);
}

function drawPlayer(){
  var imgPlayer = new Image();
  switch(hewan.avatar){
    case 0: imgPlayer.src = "assets/Idle_001.png"; break;
    case 1: imgPlayer.src = "assets/Idle_002.png"; break;
    case 2: imgPlayer.src = "assets/Idle_003.png"; break;
  }
  ctx.fillStyle = ctx.createPattern(imgPlayer, 'repeat');
  ctx.fillRect(headX * tileCount, headY*tileCount, tileSize, tileSize);
}

function drawStar(){
  var imgStar = new Image();
  imgStar.src = "assets/Yellow-Star-Transparent.png";
  ctx.fillStyle = ctx.createPattern(imgStar, 'repeat');
  ctx.fillRect(starX * tileCount, starY*tileCount, tileSize, tileSize);
}

function drawGame(){
  headX = headX + xSpeed;
  headY = headY + ySpeed;

  if(checkGameOver() || act.makan <= 25){
      exitGameBermain();
      return;
  }
  
  clearGrid();
  drawStar();
  drawPlayer();
  checkCollision();
  setTimeout(drawGame, 1000/speed);
}

function checkCollision(){
  if(starX == headX && starY == headY){
      starX = -10;
      starY = -10;
      act.main += act.mainI;
      starTaken = true;
  }
}

setInterval(function(){
  $("#mainIcon").attr("style", "height: 1.5em;");
  if(isGameOn){
      starCountdown--;
      $("#displayNotifications").text(starCountdown + "s");
      if(starCountdown == 0){
          starCountdown = 6;
          starX = Math.floor(Math.random()*tileCount);
          starY = Math.floor(Math.random()*tileCount);
          if(!starTaken){
            act.main -= act.mainD;
            $("#mainIcon").attr("style", "height: 1.5em; filter: invert(29%) sepia(82%) saturate(4347%) hue-rotate(348deg) brightness(88%) contrast(86%);");
          }
          starTaken = false;
      }
  }
}, 1000);

document.body.addEventListener('keydown', keyInput);
function keyInput(input){
    // atas
    if(event.keyCode==38 || input == 38){
        ySpeed=-1;
        xSpeed=0;
    }
    // bawah
    if(event.keyCode == 40 || input == 40){
        ySpeed=1;
        xSpeed=0;
    }
    // kiri
    if(event.keyCode == 37 || input == 37){
        ySpeed=0;
        xSpeed=-1;
    }
    // kanan
    if(event.keyCode == 39 || input == 39){
        ySpeed=0;
        xSpeed=1;
    }
}

$("#mainExitButton").click(function(){
  exitGameBermain();
});
$("#buttonMoveAtas").click(function(){
  keyInput(38);
});
$("#buttonMoveBawah").click(function(){
  keyInput(40);
});
$("#buttonMoveKiri").click(function(){
  keyInput(37);
});
$("#buttonMoveKanan").click(function(){
  keyInput(39);
});