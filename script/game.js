class Ghost {
    constructor() {
        this.posx = Math.random() * borderwidth - borderwidth / 2;
        this.posy = Math.random() * borderheight - borderheight / 2;
        this.speed = 7;
        this.size = 50;
        this.id = ghosts.length;
        this.goalx;
        this.goaly;
        this.typestep = "atack";
    }
    check_eat() {
        for (let x = 0; x < entity.length; x++) {
            if (entity[x]) {
                if (entity[x].size > 80) {
                    if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                        entity[x].size -= 4;
                        document.querySelector(`.entity.id-${entity[x].id}`).style.width = `${entity[x].size}px`;
                        document.querySelector(`.entity.id-${entity[x].id}`).style.height = `${entity[x].size}px`;
                        document.querySelector(`.entity.id-${entity[x].id}`).style.fontSize = `${entity[x].size / 2}px`;
                        if (entity[x].size < 100) {
                            entity[x].size = 0;
                            delete entity[x];
                            document.querySelector(`.entity.id-${Number(x) + 1}`).outerHTML = "";
                        }
                    }
                }
            }
        }
    }
    bot_behavior() { // интеллект бота
        let minlen = Infinity; // переменные
        let goalid;
        for (let x = 0; x < entity.length; x++) { // отслеживание добычи
            if (entity[x] && entity[x].size > 80) {
                let length = getlength(this.posx, this.posy, entity[x].posx, entity[x].posy);
                if (length < minlen && length < 1500) {
                    minlen = length;
                    goalid = x;
                    this.typestep = "atack";
                }
            }
        }
        if (entity[goalid]) {
            this.goalx = entity[goalid].posx;
            this.goaly = entity[goalid].posy;
        } else {
            if (this.typestep != "going") {
                this.goalx = Math.random() * borderwidth - borderwidth / 2;
                this.goaly = Math.random() * borderheight - borderheight / 2;
            }
            this.typestep = "going";
        }
        if (Math.abs(this.goalx - this.posx) > this.speed && this.goalx != null) { // преследование добычи
            if (this.posx < this.goalx && this.posx + this.size / 2 - 10 < borderwidth / 2) {
                this.posx += this.speed;
            } else if (this.posx > this.goalx && this.posx - this.size / 2 - 10 > borderwidth / -2) {
                this.posx -= this.speed;
            } else {
                this.goalx = null;
            }
        }
        if (Math.abs(this.goaly - this.posy) > this.speed && this.goaly != null) {
            if (this.posy < this.goaly && this.posy + this.size / 2 - 10 < borderheight / 2) {
                this.posy += this.speed;
            } else if (this.posy > this.goaly && this.posy - this.size / 2 - 10 > borderheight / -2) {
                this.posy -= this.speed;
            } else {
                this.goaly = null;
            }
        }
        if (this.goalx == null && this.goaly == null) {
            this.typestep = null;
        }
    }
    update() {
        this.check_eat();
        document.querySelector(`.ghost.id-${this.id + 1}`).style.left = `${this.posx - this.size / 2}px`;
        document.querySelector(`.ghost.id-${this.id + 1}`).style.top = `${this.posy - this.size / 2}px`;
        this.bot_behavior();
    }
}

class Packman {
    constructor(id, posx, posy, type = "bot", name) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.speed = 20;
        this.size = 50;
        this.score = 0;
        this.type = type;
        document.querySelector(`.entity.id-${this.id}`).style.filter = `hue-rotate(${Math.random() * 55 - 40}deg) drop-shadow(0px 0px 5px rgba(255, 166, 0, 0.7))`;
        if (type == "player" || type == "Xplayer") {
            this.obj = document.querySelector(`.player.id-${this.id}`);
        } else if (type == "bot") {
            this.obj = document.querySelector(`.entity.id-${this.id}`);
            this.goalx = null;
            this.goaly = null;
        }
        if (name) {
            this.name = name;
            document.querySelector(`.entity.id-${id}`).innerHTML = `<p>${this.name}</p>`;
        }
    }
    check_eat() {
        let doeat = false;
        for (let x = 0; x < drops.length; x++) {
            if (drops[x]) {
                if(checkbox(this.posx, this.posy, this.size / 2, drops[x].posx, drops[x].posy, 10) == true) {
                    this.size += 1;
                    this.score += 1;
                    let elem = document.querySelector(`.drop.id-${Number(x) + 1}`);
                    elem.parentNode.removeChild(elem);
                    delete drops[x];
                    doeat = true;
                }
            }
        }
        for (let x = 0; x < entity.length; x++) {
            if (entity[x]) {
                if (entity[x].id != this.id && this.size > entity[x].size + 10) {
                    if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                        this.size += entity[x].size / 1.5;
                        this.score += entity[x].size / 1.5;
                        let elem = document.querySelector(`.entity.id-${Number(x) + 1}`);
                        elem.parentNode.removeChild(elem);
                        delete entity[x];
                        doeat = true;
                    }
                }
            }
        }
        for (let x = 0; x < ghosts.length; x++) {
            if (ghosts[x]) {
                if (this.size < 81) {
                    if(checkbox(this.posx, this.posy, this.size / 2, ghosts[x].posx, ghosts[x].posy, ghosts[x].size / 2) == true) {
                        this.size += 25;
                        this.score += 25;
                        let elem = document.querySelector(`.ghost.id-${Number(x) + 1}`);
                        elem.parentNode.removeChild(elem);
                        delete ghosts[x];
                        doeat = true;
                    }
                }
            }
        }
        if (doeat == true) {
            document.querySelector(`.entity.id-${this.id}`).style.width = `${this.size}px`;
            document.querySelector(`.entity.id-${this.id}`).style.height = `${this.size}px`;
            document.querySelector(`.entity.id-${this.id}`).style.fontSize = `${this.size / 2}px`;
        }
    }
    bot_behavior() { // интеллект бота
        let minlen = Infinity; // переменные
        let goalid;
        let goaltype;
        let domove = false;
        for (let x = 0; x < entity.length; x++) { // отслеживание добычи
            if (ghosts[x] && this.size < 80) {
                let length = getlength(this.posx, this.posy, ghosts[x].posx, ghosts[x].posy);
                if (length < minlen && length < this.size * 4) {
                    minlen = length;
                    goaltype = "ghost";
                    goalid = x;
                }
            }
        }
        if (!goaltype) {
            minlen = Infinity;
            for (let x = 0; x < entity.length; x++) { // отслеживание добычи
                if (entity[x] && entity[x].id != this.id) {
                    let length = getlength(this.posx, this.posy, entity[x].posx, entity[x].posy);
                    if (length < minlen && entity[x].size + 10 < this.size && length < this.size * 4) {
                        minlen = length;
                        goaltype = "bot";
                        goalid = x;
                    }
                }
            }
        }
        if (!goaltype) {
            minlen = Infinity;
            for (let x = 0; x < drops.length; x++) { // отслеживание добычи
                if (drops[x]) {
                    let length = getlength(this.posx, this.posy, drops[x].posx, drops[x].posy);
                    if (length < minlen) {
                        goaltype = "drop";
                        minlen = length;
                        goalid = x;
                    }
                }
            }
        }
        if (goaltype == "drop" && drops[goalid]) {
            this.goalx = drops[goalid].posx;
            this.goaly = drops[goalid].posy;
        } 
        if (goaltype == "bot" && entity[goalid]) {
            this.goalx = entity[goalid].posx;
            this.goaly = entity[goalid].posy;
        }
        if (goaltype == "ghost" && ghosts[goalid]) {
            this.goalx = ghosts[goalid].posx;
            this.goaly = ghosts[goalid].posy;
        }
        if (Math.abs(this.goalx - this.posx) > this.speed && this.goalx != null) { // преследование добычи
            if (this.posx < this.goalx && this.posx + this.size / 2 - 10 < borderwidth / 2) {
                this.posx += this.speed;
                domove = true;
            } else if (this.posx > this.goalx && this.posx - this.size / 2 - 10 > borderwidth / -2) {
                this.posx -= this.speed;
                domove = true;
            } else {
                this.goalx = null;
            }
        }
        if (Math.abs(this.goaly - this.posy) > this.speed && this.goaly != null) {
            if (this.posy < this.goaly && this.posy + this.size / 2 - 10 < borderheight / 2) {
                this.posy += this.speed;
                domove = true;
            } else if (this.posy > this.goaly && this.posy - this.size / 2 - 10 > borderheight / -2) {
                this.posy -= this.speed;
                domove = true;
            } else {
                this.goaly = null;
            }
        }
        if (domove == true) {
            document.querySelector(`.entity.id-${this.id}`).style.left = `${this.posx - this.size / 2}px`;
            document.querySelector(`.entity.id-${this.id}`).style.top = `${this.posy - this.size / 2}px`;
        }
    }
    update() {
        this.check_eat();

        if (this.type == "Xplayer") {
            document.querySelector(`.entity.id-${player.id}`).style.left = `${document.body.clientWidth / 2 - player.size / 2}px`;
            document.querySelector(`.entity.id-${player.id}`).style.top = `${document.body.clientHeight / 2 - player.size / 2}px`;
            if (this.size < 1201) {
                scale = 1 - ((0.7 / 1150) * this.size);
            } else {
                scale = 0.3;
            }

        }
        this.speed = (1000 / this.size) + (500 / this.size);
        if (this.type == "bot") {
            this.bot_behavior();
        }
    }
}

class Drop {
    constructor(id) {
        this.posx = Math.random() * (borderwidth - 10) - (borderwidth - 10) / 2;
        this.posy = Math.random() * (borderheight - 10) - (borderheight - 10) / 2;
        this.size = 20;
        this.id = id;
    }
    update() {
        document.querySelector(`.drop.id-${this.id + 1}`).style.left = `${this.posx - this.size / 2}px`;
        document.querySelector(`.drop.id-${this.id + 1}`).style.top = `${this.posy - this.size / 2}px`;
        document.querySelector(`.drop.id-${this.id + 1}`).style.width = `${this.size}px`;
        document.querySelector(`.drop.id-${this.id + 1}`).style.height = `${this.size}px`;
        this.size -= 0.1;
        if (this.size < 5) {
            let elem = document.querySelector(`.drop.id-${this.id + 1}`);
            elem.parentNode.removeChild(elem);
            delete drops[this.id];
        }
    }
}

let buttons = {"left": false, "right": false, "top": false, "bottom": false};
let drops = [];
let entity = [];
let ghosts = [];
let player;
let borderwidth = 8000;
let borderheight = 3000;
let scale = 1;
let changename = null;
var audio1 = new Audio('../sounds/PackmanFight.mp3');
let audioactive = false;
let gamestart = false;
let playerlive = true;
let mouseX = 1000;
let mouseY = 1000;
//new Packman(2, 100, 100, "bot", "TestUser")

function getlength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function checkbox(x1, y1, size1, x2, y2, size2) {
    if (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) - (size1 + size2) < 0) {
        return true;
    }
}

function checkbuttons() {
    document.body.addEventListener("keydown", function(k) {
        if (k.key == "ArrowLeft") {
            buttons.left = true;
        }
        if (k.key == "ArrowRight") {
            buttons.right = true;
        }
        if (k.key == "ArrowUp") {
            buttons.top = true;
        }
        if (k.key == "ArrowDown") {
            buttons.bottom = true;
        }
    })
    document.body.addEventListener("keyup", function(k) {
        if (k.key == "ArrowLeft") {
            buttons.left = false;
        }
        if (k.key == "ArrowRight") {
            buttons.right = false;
        }
        if (k.key == "ArrowUp") {
            buttons.top = false;
        }
        if (k.key == "ArrowDown") {
            buttons.bottom = false;
        }
    })
    if (buttons.left == false && buttons.right == false && buttons.top == false && buttons.bottom == false) {
        sensorblock = false;
    } else {
        sensorblock = true;
    }
}
document.body.addEventListener("mouseup", function(click) {
    downmouse = false;
})

document.body.addEventListener("mousedown", function(click) {
    downmouse = true;
    mouseX = click.clientX;
    mouseY = click.clientY;
})
document.body.addEventListener("mousemove", function(move) {
    mouseX = move.clientX;
    mouseY = move.clientY;
})
document.body.addEventListener("touchmove", function(move) {
    downmouse = true;
    console.log(move.touches[0].screenX);
    mouseX = move.touches[0].screenX;
    mouseY = move.touches[0].screenY;
})

let downmouse = false;
let sensorblock = false

function checksensor() {
    //console.log(downmouse + " " + gamestart);
    if (sensorblock == false && downmouse == true && gamestart == true) {
        let xcenter = document.body.clientWidth / 2; 
        let ycenter = document.body.clientHeight / 2; 
        let ybust = Math.abs((ycenter - mouseY) / ycenter) * 3;
        if (ybust > 1) {
            ybust = 1;
        }
        let xbust = Math.abs((xcenter - mouseX) / xcenter) * 3;
        if (xbust > 1) {
            xbust = 1;
        }
        if (xcenter > mouseX && player.posx - player.size / 2 - 10 > borderwidth / -2) {
            player.posx -= player.speed * xbust;
        }
        if (xcenter < mouseX && player.posx + player.size / 2 - 10 < borderwidth / 2) {
            player.posx += player.speed * xbust;
        }
        if (ycenter > mouseY && player.posy - player.size / 2 - 10 > borderheight / -2) {
            player.posy -= player.speed * ybust;
        } 
        if (ycenter < mouseY && player.posy + player.size / 2 - 10 < borderheight / 2) {
            player.posy += player.speed * ybust;
        }
    }
}

function checkentity() {
    for (let x = 0; x < entity.length; x++) {
        if (entity[x]) {
            entity[x].update();
        }
    }
    for (let x = 0; x < drops.length; x++) {
        if (drops[x]) {
            drops[x].update();
        }
    }
    for (let x = 0; x < ghosts.length; x++) {
        if (ghosts[x]) {
            ghosts[x].update();
        }
    }
    if (!document.querySelector("#player")) {
        playerlive = false; 
    } else {
        playerlive = true;
    }
}

function movePlayer() {
    if (buttons.left == true && player.posx - player.size / 2 - 10 > borderwidth / -2) {
        player.posx -= player.speed;
    }
    if (buttons.right == true && player.posx + player.size / 2 - 10 < borderwidth / 2) {
        player.posx += player.speed;
    }
    if (buttons.top == true && player.posy - player.size / 2 - 10 > borderheight / -2) {
        player.posy -= player.speed;
    } 
    if (buttons.bottom == true && player.posy + player.size / 2 - 10 < borderheight / 2) {
        player.posy += player.speed;
    } 

    offsetX = (document.body.clientWidth / 2) - player.posx;
    offsetY = (document.body.clientHeight / 2) - player.posy;
}

function leaderboard_update() {
    let mas = [];
    let finalmas = [];
    let max;
    let thisid;
    for (let x = 0; x < entity.length; x++) {
        if (entity[x]) {
            mas.push({"size": entity[x].size, "name": entity[x].name, "score": entity[x].score});
        }
    }
    for (let y = 0; y < mas.length; y++) { 
        max = 0;
        for (let x = 0; x < mas.length; x++) {
            if (mas[x] && mas[x].size > max) {
                max = mas[x].size;
                thisid = x;
            }
        }
        finalmas[y] = mas[thisid];
        delete mas[thisid];
    }
    let resultul = "";
    for (let x = 0; x < 6 && x < finalmas.length; x++) {
        resultul += `<li>${finalmas[x].name} - ${Math.round(finalmas[x].size)} [${Math.round(finalmas[x].score)}]</li>`;
    }
    resultul += `<li style="border-top: 2px solid white; padding-top: 10px">${player.name} - ${Math.round(player.size)} силы. <br>Всего ${Math.round(player.score)} очков</li>`
    document.querySelector(".leaderboard ul").innerHTML = resultul;
}

function border_control() {
    let obj_border = document.querySelector(".game__border");
    obj_border.style.width = `${borderwidth}px`;
    obj_border.style.height = `${borderheight}px`;
    obj_border.style.left = `${borderwidth / -2}px`;
    obj_border.style.top = `${borderheight / -2}px`;
}
function gamecontainer_control() {
    document.querySelector(".game__container").style.transform = `scale(${scale})`;
    document.querySelector("#game").style.backgroundPosition = `${offsetX * scale}px ${offsetY * scale}px`;
    document.querySelector("#game").style.backgroundSize = `${scale * 400}px`;
    document.querySelector(".game__area").style.left = `${offsetX}px`;
    document.querySelector(".game__area").style.top = `${offsetY}px`;
}
function startgame() {
    document.querySelector(".game__border, #player, .leaderboard").style.display = "flex";
    document.querySelector(".game__menu, .leave").style.display = "none";
    document.querySelector(`.entity.id-${player.id}`).style.left = `${document.body.clientWidth / 2 - player.size / 2}px`;
        document.querySelector(`.entity.id-${player.id}`).style.top = `${document.body.clientHeight / 2 - player.size / 2}px`;
    border_control();
    if (audioactive == false) {
        audio1.play();
        audioactive = true;
    }
}
function getRandTitle() {
    let rand = Math.round(Math.random() * 10);
    switch (rand) {
        case 0: return "Стань лучшим пакменом";
        case 1: return "Стань сильнейшим пакменом!!";
        case 2: return "Стань самым крупным))";
        case 3: return "Съешь всех пакменов";
        case 4: return "Пакмен. Просто пакмен...";
        case 5: return "Пакмены прикольные))"; 
        case 6: return "Ешь синие сферы.. ам!!";
        case 7: return "Убегай от призраков.. Ааа...";  
        case 8: return "Трофик молодец))"; 
        case 9: return "Гигантские пакмены!!!";
        case 10: return "Самая прикольная игра!!";  
    }
}
function stopgame() {
    document.querySelector(".menu__header h2").innerHTML = `PackMan.io - ${getRandTitle()}`;
    document.querySelector(".game__border, .leaderboard").style.display = "none";
    document.querySelector(".leave").style.display = "none";
    document.querySelector(".game__menu").style.display = "flex";
    if (document.querySelector("#player")) {
        document.querySelector("#player").style.display = "none";
    }
    document.querySelectorAll(".entity, .drop, .ghost").forEach(function(en) {
        en.outerHTML = "";
    })
}
stopgame();

function update() {
    if (gamestart == true) {
        checkbuttons();
        movePlayer();
        checkentity();
        checksensor();
        leaderboard_update();
        gamecontainer_control();
        if (audio1.currentTime == audio1.duration) {
            audio1.play();
        }
    }
    if (playerlive == false && gamestart == true) {
        document.querySelector(".leave").style.display = "flex";
    }
}

function nickgen() { // генерация ников
    let nick = "";
    let random;
    for (let act = 0; act < Math.round(Math.random() * 3 + 2); act++) {
        random = Math.round(Math.random() * 40);
        switch (random) {
            case 0: nick += "nik"; break;
            case 1: nick += "zig"; break;
            case 2: nick += "zag"; break;
            case 3: nick += String(Math.round(Math.random() * 100)); break;
            case 4: nick += "le"; break;
            case 5: nick += "tro"; break;
            case 6: nick += "fik"; break;
            case 7: nick += "tan"; break;
            case 8: nick += "st"; break;
            case 9: nick += "fro"; break;
            case 10: nick += "ru"; break;
            case 11: nick += "na"; break;
            case 12: nick += "sa"; break;
            case 13: nick += "to"; break;
            case 14: nick += "ske"; break;
            case 15: nick += "ya"; break;
            case 16: nick += String(Math.round(Math.random() * 100)); break;
            case 17: nick += "ra"; break;
            case 18: nick += "ma"; break;
            case 19: nick += "by"; break;
            case 20: nick += String(Math.round(Math.random() * 1 + 23)); break;
            case 21: nick += "ke"; break;
            case 22: nick += "iva"; break;
            case 23: nick += "ra"; break;
            case 24: nick += "an"; break;
            case 25: nick += "rd"; break;
            case 26: nick += "ser"; break;
            case 27: nick += "ge"; break;
            case 28: nick += "jo"; break;
            case 29: nick += "nny"; break;
            case 30: nick += "ske"; break;
            case 31: nick += "tan"; break;
            case 32: nick += "ota"; break;
            case 33: nick += "ku"; break;
            case 34: nick += "x"; break;
            case 35: nick += "su"; break;
            case 36: nick += "nik"; break;
            case 37: nick += "egu"; break;
            case 38: nick += "wa"; break;
            case 39: nick += "in"; break;
            case 40: nick += "er"; break;
        }
    }
    return nick;
}

function dropgen() { // Генерация сфер
    if (gamestart == true) {
        let y = -1;
        for (let x = 0; x < drops.length; x++) {
            if (!drops[x]) {
                y = x;
                break;
            }
        }
        if (y == -1) {
            y = drops.length
            drops.push(new Drop(y));
        } else {
            drops[y] = new Drop(y);
        }
        document.querySelector(".game__area").innerHTML += `<div class="drop id-${y + 1}"></div>`;
        document.querySelector(`.drop.id-${y + 1}`).style.left = `${drops[y].posx - drops[y].size / 2}px`;
        document.querySelector(`.drop.id-${y + 1}`).style.top = `${drops[y].posy - drops[y].size / 2}px`;
    }
}

function botgen() { // Генерация ботов
    if (gamestart == true) {
        document.querySelector(".game__area").innerHTML += `<div class="packman bot entity id-${entity.length + 1}"></div>`;
        entity.push(new Packman(entity.length + 1, Math.random() * borderwidth - borderwidth / 2, Math.random() * borderheight - borderheight / 2, "bot", nickgen()));
        document.querySelector(`.entity.id-${entity.length}`).style.left = `${entity[entity.length - 1].posx - entity[entity.length - 1].size / 2}px`;
        document.querySelector(`.entity.id-${entity.length}`).style.top = `${entity[entity.length - 1].posy - entity[entity.length - 1].size / 2}px`;
    }
}

function ghostgen() { // Генерация призраков
    if (gamestart == true) {
        document.querySelector(".game__area").innerHTML += `<div class="ghost id-${ghosts.length + 1}"></div>`;
        ghosts.push(new Ghost());
        document.querySelector(`.ghost.id-${ghosts.length}`).style.left = `${ghosts[ghosts.length - 1].posx - ghosts[ghosts.length - 1].size / 2}px`;
        document.querySelector(`.ghost.id-${ghosts.length}`).style.top = `${ghosts[ghosts.length - 1].posy - ghosts[ghosts.length - 1].size / 2}px`;
    }
}

setInterval(botgen, 3000);
setInterval(update, 60);
setInterval(dropgen, 100);
setInterval(ghostgen, 17000);

document.querySelector("#gamestart").addEventListener("click", function() {
    gamestart = true;
    document.querySelector(".game__container").innerHTML += '<div class="packman player entity id-1" id="player"></div>';
    if (!changename) {
        changename = nickgen();
    }
    player = new Packman(1, 0, 50, "Xplayer", changename);
    entity.push(player);
    playerlive = true;
    startgame();
})
document.querySelector("#leave").addEventListener("click", function() {
    gamestart = false;
    player = null;
    entity = [];
    drops = [];
    ghosts = [];
    stopgame();
})
document.querySelector("#name").addEventListener("keydown", function(a) {
    if (a.key = "Enter") {
        changename = document.querySelector('#name').value;
    }
})