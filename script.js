let game = document.querySelector("#game");
let tools = document.querySelector(".tools");
let instruction = document.querySelector(".instruction");
let map = [];
let minelocate = [];
let gameover = false;
let gameplay = false;
let difficulty = "easy";

function GenArea(maxx, maxy, propmine, diff) {
  gameover = false;
  map = [];
  difficulty = diff
  winner = false;
  minelocate = [];
  for (y in map) {
    map[y] = "";
  }
  if (document.body.clientWidth < 550) {
    game.style.width = `${maxx * 61 + 5}px`;
  } 
  let random;
  let gencount = 0
  for (let y = 0; y < maxy; y++) {
    let raw = "";
    for (let x = 0; x < maxx; x++) {
      random = Math.random() * 100;
      randomNullGenX = Math.random();
      if (propmine > random) {
        minelocate[gencount] = {"x": x, "y": y};
        raw += "m";
      } else {
        raw += "a";
      }
      gencount += 1;
    } 
    map[y] = raw;
  }
  DrawArea(map);
}
function DrawArea(map) {
  let areascal = 1;
  if (difficulty == "easy") {
    var otstup = 100;
  } else if (difficulty == "normal") {
    var otstup = 50;
  } else if (difficulty == "hard") {
    var otstup = 0;
    areascal = 0.89;
  }
  document.querySelectorAll(".area").forEach(function(deletearea) {
    deletearea.outerHTML = "";
  })
  let nullarea = false;
  for (let y in map) {
    for (let x in map[y]) {
      let area = document.createElement("div");
      area.classList.add("area");
      area.classList.add(`coord-x-${x}`);
      area.classList.add(`coord-y-${y}`);
      if (document.body.clientWidth > 550) {
        area.style.left = `${x * 61 * areascal + otstup}px`;
        area.style.transform = `scale(${areascal})`;
        area.style.top = `${y * 61 * areascal}px`
        tools.style.top = `${map.length * 61 * areascal + 10}px`;
      } else {
        area.style.left = `${x * 61}px`;
        area.style.top = `${y * 61}px`
        game.style.transform = `scale(${document.body.clientWidth / game.style.width.replace("px", "")}) translateX(${(game.style.width.replace("px", "") - game.style.width.replace("px", "") * (game.style.width.replace("px", "") / document.body.clientWidth)) / 2}px) translateY(${(game.style.height.replace("px", "") - game.style.height.replace("px", "") * (game.style.width.replace("px", "") / document.body.clientWidth)) / 2}px)`;
        tools.style.top = `${map.length * 61 + 10}px`;
      }
      if (map[y][x] == "m") {
        area.classList.add("area-mine");
        area.classList.add("area-close");
      }
      if (map[y][x] == "a" || map[y][x] == "n") { 
        let minecount = 0;
        for (let z in minelocate) {
          if (Math.abs(minelocate[z].x - x) <= 1) {
            if (Math.abs(minelocate[z].y - y) <= 1) {
              minecount += 1;
            }
          }
        }
        if (minecount > 0) {
          area.classList.add(`around-${minecount}`);
          area.innerHTML += `<p>${minecount}</p>`;
        }
        area.classList.add("area-close");
        if ((minecount == 0 && nullarea == false) && ((map.length / 2 - 3 < y) && (map.length / 2 + 3 > y))) {
          area.classList.add("area-first");
          nullarea = true;
        } 
      }
      
      game.append(area);
    }
  }
}
function GameOver() {
  gameover = true;
  document.querySelectorAll(".area-mine").forEach(function(mineopen) {
    mineopen.classList.remove("area-close");
    mineopen.classList.add("area-open");
  })
  audio.pause();
  var audiogameover = new Audio();
  audiogameover.src = "audio/GameOver.mp3";
  audiogameover.play();
}

var audio = new Audio();
audio.src = "audio/FirstExpert\ -\ TitanExpert.mp3";
let menuacts = null;

function menuAction(act, butx) {
  if (butx.classList.contains("active") == false) {
    document.querySelectorAll(".tools button").forEach(function(but) {
      but.classList.remove("active");
    })
    butx.classList.add("active");
    menuacts = act;
  } else {
    butx.classList.remove("active");
    menuacts = null;
    document.querySelectorAll(".tools button").forEach(function(but) {
      but.classList.remove("active");
    })
  }
  if (menuacts == "reset") {
    butx.classList.add("active");
    if (difficulty == "easy") {
      GenArea(10, 10, 10, "easy");
    }
    if (difficulty == "normal") {
      GenArea(12, 10, 20, 'normal');
    }
    if (difficulty == "hard") {
      GenArea(15, 12, 33, 'hard');
    }
    gameover = false;
    menuacts = null;
    wingame = false;
    audio.play();
    AreaChecker();
    setTimeout(() => {butx.classList.remove("active")}, 1000);
  }
  if (menuacts == "vk") {
    vkBridge.send("VKWebAppJoinGroup", {group_id: 217181628})
    .then((data) => { 
      if (data.result) {
        butx.classList.remove("active");
        butx.classList.add("iftrue");
      }
    })
    .catch((error) => {
      // Ошибка
      butx.classList.remove("active");
    }); 
  }
  if (menuacts == "info") {
    document.querySelector(".instruction").classList.remove("hidden");
  } else {
    document.querySelector(".instruction").classList.add("hidden");
  }
  if (menuacts == "add") {
    vkBridge.send('VKWebAppShare', {link: 'https://vk.com/app51487141'})
  }
  if (menuacts == "menu") {
    document.querySelector(".menu").classList.remove("hidden");
    if (gameplay == true) {
      document.querySelector("#menu-game-play").classList.remove("hidden");
    } else {
      document.querySelector("#menu-game-play").classList.add("hidden");
    }
  }
}
function AreaChecker() { // запускает проверку на клики, когда перезапускаешь карту, клетки создаются заново и нужна новая проверка
  document.querySelectorAll(".area").forEach(function(areaop) {
    areaop.addEventListener('click', function(polecl) {
      if (gameover == false && menuacts != "flag" && areaop.classList.contains("flag") == false) {
        areaop.classList.remove("area-close");
        areaop.classList.add('area-open');
        if (areaop.classList.contains("area-mine")) {
          GameOver();
        }
      }
      if (menuacts == "flag" && gameover == false && areaop.classList.contains("area-close") == true) {
        areaop.classList.toggle('flag');
      }
    })
  })
}
function wingames() {
  var audiowin = new Audio();
  audiowin.src = "audio/Winner.mp3";
  audiowin.play();
  audio.pause();
  document.querySelectorAll(".area").forEach(function(win) {
    win.classList.add("win-theme");
  })
}
let closecount = 0;
let wingame = false;
function tick() {
  if (document.querySelector(".menu").classList.contains("hidden") == false) {
    document.querySelectorAll(".area, .tools").forEach(function(allblur) {
      allblur.style.filter = "opacity(0.6) blur(1.5px)";
    })
  } else {
    document.querySelectorAll(".area, .tools").forEach(function(allblur) {
      allblur.style.filter = "blur(0px)";
    })
  }
  document.documentElement.scrollTop = 0;
  document.addEventListener('click', function() {
    if(Math.round(audio.currentTime) == 0) {
      audio.play();
    }
  })
  if (Math.round(audio.currentTime) == Math.round(audio.duration) && gameover == false) {
    audio.play();
  }
  document.querySelectorAll(".area-close:not(.area-mine)").forEach(function(checkarea) {
    closecount += 1;
  })
  if (closecount == 0 && wingame == false) {
    wingame = true;
    wingames();
  }
  closecount = 0;
}
function PlayAct() {
  document.querySelectorAll("#game-easy, #game-normal, #game-hard, #menu-back").forEach(function(one123) {
    one123.classList.remove("hidden");
    document.querySelector("#menu-game-new").classList.add("hidden");
    if (gameplay == "true") {
      document.querySelector("#menu-game-play").classList.add("hidden");
    }
  })
}
function MenuBack() {
  document.querySelectorAll("#game-easy, #game-normal, #game-hard, #menu-back").forEach(function(one123) {
    one123.classList.add("hidden");
    document.querySelector("#menu-game-new").classList.remove("hidden");
    if (gameplay == "true") {
      document.querySelector("#menu-game-play").classList.remove("hidden");
    }
  })
}
function PlayGo() {
  document.querySelector(".menu").classList.add("hidden");
  document.querySelectorAll("#game-easy, #game-normal, #game-hard, #menu-back").forEach(function(one123) {
    one123.classList.add("hidden");
    document.querySelector("#menu-game-new").classList.remove("hidden");
    document.querySelector("#menu-game-play").classList.remove("hidden");
  })
  gameplay = true;
  AreaChecker();
}
GenArea(10, 10, 10, "easy");

setInterval(tick, 100);



