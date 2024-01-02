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
            if (entity[x] && entity[x].isghost == false) {
                if (entity[x].size > 80) {
                    if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                        if (entity[x].size < 100) {
                            entity[x].size = 81;
                            entity[x].isghost = true;
                            entity[x].become_ghost();
                            entity[x].viewupdate();
                        } else {
                            entity[x].size -= 2;
                            entity[x].viewupdate();
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
            if (entity[x] && entity[x].isghost == false && entity[x].size > 80) {
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
        let this_obj = document.querySelector(`.ghost.id-${this.id + 1}`);
        this_obj.style.left = `${this.posx - this.size / 2}px`;
        this_obj.style.top = `${this.posy - this.size / 2}px`;
        this.bot_behavior();
    }
}

class Packman {
    constructor(id, posx, posy, type = "bot", name, isghost = false) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.speed = 20;
        this.size = 50;
        this.score = 0;
        this.boost = [{name: 'speed', power: 1, time: 0}];
        this.type = type;
        this.isghost = isghost;
        if (isghost == true) {
            document.querySelector(`.entity.id-${this.id}`).classList.add("packman__ghost");
            document.querySelector(`.entity.id-${this.id}`).style.filter = `drop-shadow(0px 0px 5px rgb(67, 208, 255))`;
        } else {
            document.querySelector(`.entity.id-${this.id}`).style.filter = `hue-rotate(${Math.random() * 55 - 40}deg) drop-shadow(0px 0px 5px rgba(255, 166, 0, 0.7))`;
            //document.querySelector(`.entity.id-${this.id}`).style.filter = `drop-shadow(0px 0px 5px rgba(0px 0px 3px aqua))`;
        }
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
    emotion(emotion) {
        let this_obj = document.querySelector(`.entity.id-${this.id}`);
        this_obj.classList.add(emotion);
        setTimeout(() => {
            if (this && this_obj) {
                this_obj.classList.remove(emotion);
            }
        }, 5000);
    }
    viewupdate() {
        document.querySelector(`.entity.id-${this.id}`).style.transform = `scale(${this.size / 50})`;
        if (this.type == "Xplayer") {
            if (this.size < 1201) {
                scale = 1 - (0.0006 * this.size);
            } else {
                scale = 0.3;
            }
            let player_obj = document.querySelector(`.entity.id-${this.id}`);
            player_obj.style.left = `${(clWidth + ((clWidth / scale) - clWidth)) / 2 - player_obj.clientWidth / 2}px`;
            player_obj.style.top = `${clHeight / 2 - player_obj.clientHeight / 2}px`;
            playerscore = player.score;
            localStorage.setItem('sumscore', Number(localStorage.getItem('sumscore')) + (playerscore - scoreload));
            scoreload = playerscore;
            playerscore = 0;
        }
        if (!this.isghost) {
            this.speed = 1000 / this.size * this.boost[0].power;
        } else {
            this.speed = 750 / this.size * this.boost[0].power;
        }
        leaderboard_update();
    }
    become_ghost() {
        document.querySelector(`.entity.id-${this.id}`).classList.add("packman__ghost");
        document.querySelector(`.entity.id-${this.id}`).style.filter = `drop-shadow(0px 0px 5px rgb(67, 208, 255))`;
        this.size = 81;
        this.isghost = true;
        this.emotion();
        this.viewupdate();
        if (this.type == "Xplayer") {showmessage("Вы стали призраком")}
        if (this.type == "Xplayer") {
            document.querySelector("#game").style.filter = "sepia(0.4)"; 
        }
    }
    check_eat() {
        if (this.isghost == false) {
            for (let x = 0; x < drops.length; x++) {
                if (drops[x]) {
                    if(checkbox(this.posx, this.posy, this.size / 2, drops[x].posx, drops[x].posy, 20) == true) {
                        if (drops[x].type == "mega") {
                            this.size += 30;
                            this.score += 30;
                            this.emotion("smile");
                            if (this.type == "Xplayer") {showmessage("Вы съели мега-сферу | +30 очков")}
                        } else if (drops[x].type == "ultra") {
                            this.size += 10;
                            this.score += 10;
                            this.emotion("smile");
                            if (this.type == "Xplayer") {showmessage("Вы съели ультра-сферу | +10 очков")}
                        } else {
                            this.size += 1;
                            this.score += 1;
                        }
                        delete drops[x];
                        let elem = document.querySelector(`.drop.id-${Number(x) + 1}`);
                        elem.parentNode.removeChild(elem);
                        this.viewupdate();
                    }
                }
            }
        }
        for (let x = 0; x < entity.length; x++) {
            if (entity[x]) {
                if (this.isghost) { 
                    if (entity[x].id != this.id && entity[x].isghost == false && this.size < entity[x].size - 3) {
                        if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                            if (this.size + 7 > entity[x].size) {
                                entity[x].become_ghost();
                                this.emotion("smile");
                                if (this.type == "Xplayer") {showmessage("Вы превратили пакмена в призрака")}
                            } else {
                                entity[x].size -= 2;
                                this.size += 2;
                                this.score += 2;
                                if (Math.round(this.size) % 4 == 0) {
                                    this.viewupdate();
                                    entity[x].viewupdate();
                                } else if (Math.round(this.size) % 3 == 0) {
                                    this.viewupdate();
                                    entity[x].viewupdate();
                                }
                            }
                        }
                    } else if (entity[x].id != this.id && entity[x].isghost == true && this.size - 10 > entity[x].size && entity[x].size > 82) {
                        if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                            this.size += entity[x].size / 1.5;
                            this.score += entity[x].size / 1.5;
                            let elem = document.querySelector(`.entity.id-${Number(x) + 1}`);
                            elem.parentNode.removeChild(elem);
                            if (this.type == "Xplayer") {showmessage("Вы съели призрака")}
                            if (entity[x].type == "Xplayer") {showmessage("Вас съел призрак")}
                            this.viewupdate();
                            this.emotion("smile");
                            delete entity[x];
                        }
                    }
                } else {
                    if (entity[x].id != this.id && entity[x].isghost == false && this.size > entity[x].size + 10) {
                        if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                            this.size += entity[x].size / 1.5;
                            this.score += entity[x].size / 1.5;
                            let elem = document.querySelector(`.entity.id-${Number(x) + 1}`);
                            elem.parentNode.removeChild(elem);
                            this.viewupdate();
                            this.emotion("smile");
                            if (this.type == "Xplayer") {showmessage("Вы съели пакмена")}
                            if (entity[x].type == "Xplayer") {showmessage("Вас съел пакмен")}
                            delete entity[x];
                        }
                    } else {
                        if (entity[x].id != this.id && entity[x].isghost == true && this.size < entity[x].size) {
                            if(checkbox(this.posx, this.posy, this.size / 2, entity[x].posx, entity[x].posy, entity[x].size / 2) == true) {
                                this.size += entity[x].size / 1.5;
                                this.score += entity[x].size / 1.5;
                                let elem = document.querySelector(`.entity.id-${Number(x) + 1}`);
                                elem.parentNode.removeChild(elem);
                                this.viewupdate();
                                this.emotion("smile");
                                if (this.type == "Xplayer") {showmessage("Вы съели призрака")}
                                if (entity[x].type == "Xplayer") {showmessage("Вас съел пакмен")}
                                delete entity[x];
                            }
                        } 
                    }
                }
            }
        }
        for (let x = 0; x < ghosts.length; x++) {
            if (ghosts[x]) {
                if ((this.isghost == false && this.size < 81) || (this.isghost == true && this.size > 100)) {
                    if(checkbox(this.posx, this.posy, this.size / 2, ghosts[x].posx, ghosts[x].posy, ghosts[x].size / 2) == true) {
                        this.size += 25;
                        this.score += 25;
                        let elem = document.querySelector(`.ghost.id-${Number(x) + 1}`);
                        elem.parentNode.removeChild(elem);
                        this.viewupdate();
                        this.emotion("smile");
                        if (this.type == "Xplayer") {showmessage("Вы съели призрака")}
                        delete ghosts[x];
                    }
                }
            }
        }
    }
    bot_behavior() { // интеллект бота
        let minlen = Infinity; // переменные
        let goalid;
        let goaltype;
        let domove = false;
        if ((this.isghost == false && this.size < 81) || (this.isghost == true && this.size > 100)) {
            for (let x = 0; x < entity.length; x++) { // отслеживание добычи
                if (ghosts[x]) {
                    let length = getlength(this.posx, this.posy, ghosts[x].posx, ghosts[x].posy);
                    if (length < minlen && length < this.size * 4) {
                        minlen = length;
                        goaltype = "ghost";
                        this.goalx = ghosts[x].posx;
                        this.goaly = ghosts[x].posy;
                    }
                }
            }
        }
        if (!goaltype) {
            minlen = Infinity;
            for (let x = 0; x < entity.length; x++) { // отслеживание добычи
                if (entity[x] && entity[x].id != this.id) {
                    let length = getlength(this.posx, this.posy, entity[x].posx, entity[x].posy);
                    if (length < minlen && length < this.size * 6) {
                        if (this.isghost == true) {
                            if (entity[x].isghost == false && this.size < entity[x].size - 10) {
                                minlen = length;
                                goaltype = "bot";
                                this.goalx = entity[x].posx;
                                this.goaly = entity[x].posy;
                            } else if (entity[x].isghost == true && this.size - 10 > entity[x].size && entity[x].size > 81) {
                                minlen = length;
                                goaltype = "bot";
                                this.goalx = entity[x].posx;
                                this.goaly = entity[x].posy;
                            }
                        } else {
                            if (entity[x].isghost == false && entity[x].size + 10 < this.size && this.size > 99) {
                            minlen = length;
                            goaltype = "bot";
                            this.goalx = entity[x].posx;
                            this.goaly = entity[x].posy;
                            } else if (entity[x].isghost == true && this.size < entity[x].size) {
                                minlen = length;
                                goaltype = "bot";
                                this.goalx = entity[x].posx;
                                this.goaly = entity[x].posy;
                            } 
                        }
                    }
                }
            }
        }
        if (!goaltype && this.isghost == false) {
            minlen = Infinity;
            for (let x = 0; x < drops.length; x++) { // отслеживание добычи
                if (drops[x]) {
                    let length = getlength(this.posx, this.posy, drops[x].posx, drops[x].posy);
                    if (length < minlen) {
                        goaltype = "drop";
                        minlen = length;
                        this.goalx = drops[x].posx;
                        this.goaly = drops[x].posy;
                    }
                }
            }
        }
        if (!goaltype && (this.goalx == null || this.goaly == null)) {
            this.goalx = (borderwidth * Math.random()) - (borderwidth / 2);
            this.goaly = (borderheight * Math.random()) - (borderheight / 2);
            goaltype = "random";
        }
        if (Math.abs(this.goalx - this.posx) > this.speed) { // преследование добычи
            if (this.posx < this.goalx && this.posx + this.size / 2 - 10 < borderwidth / 2) {
                this.posx += this.speed;
                domove = true;
            } else if (this.posx > this.goalx && this.posx - this.size / 2 - 10 > borderwidth / -2) {
                this.posx -= this.speed;
                domove = true;
            }
        } else {
            this.goalx = null;
        }
        if (Math.abs(this.goaly - this.posy) > this.speed) {
            if (this.posy < this.goaly && this.posy + this.size / 2 - 10 < borderheight / 2) {
                this.posy += this.speed;
                domove = true;
            } else if (this.posy > this.goaly && this.posy - this.size / 2 - 10 > borderheight / -2) {
                this.posy -= this.speed;
                domove = true;
            }
        } else {
            this.goaly = null;
        }
        if (domove == true) {
            let this_obj = document.querySelector(`.entity.id-${this.id}`);
            this_obj.style.left = `${this.posx - 25}px`;
            this_obj.style.top = `${this.posy - 25}px`;
        }
    }
    update() {
        this.check_eat();
        if (this.type == "bot") {
            this.bot_behavior();
        }
        if (this.boost[0].time > 0) {
            this.boost[0].time -= 0.04;
        } else {
            if (this.boost[0].power != 1) {
                this.boost[0].time = 0;
                this.boost[0].power = 1;
                this.viewupdate();
            }
        }
    }
}

class Drop {
    constructor(id) {
        this.posx = Math.random() * (borderwidth - 10) - (borderwidth - 10) / 2;
        this.posy = Math.random() * (borderheight - 10) - (borderheight - 10) / 2;
        this.id = id;
        let randtype = Math.round(Math.random() * 100);
        if (randtype <= 1) {
            this.type = "mega";
            this.size = 40;
        } else if (randtype > 1 && randtype <= 7) {
            this.type = "ultra";
            this.size = 30;
        } else {
            this.type = "default"; 
            this.size = 20;
        }
    }
    update() {
        this.size -= 0.08;
        if (Math.round(this.size) % 3 == 0) {
            document.querySelector(`.drop.id-${this.id + 1}`).style.transform = `scale(${this.size / 20})`;
        }
        if (this.size < 5) {
            document.querySelector(`.drop.id-${this.id + 1}`).parentNode.removeChild(document.querySelector(`.drop.id-${this.id + 1}`));
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
let scale = 0.97;
let changename = null;
var audio1 = new Audio('sounds/PackmanFight.mp3');
let audioactive = false;
let gamestart = false;
let playerlive = true;
let mouseX = 1000;
let mouseY = 1000;
let clWidth = document.body.clientWidth;
let clHeight = document.body.clientHeight;
let playerscore = 0;
let scoreload = 0;

function getlength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function checkbox(x1, y1, size1, x2, y2, size2) {
    if (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) - (size1 + size2) < 0) {
        return true;
    }
}
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

let downmouse = false;
let sensorblock = false
let cursorposset = false;
let touchpointx;
let touchpointy;
let xcenter;
let ycenter;

function checksensor() {
    if (buttons.left == false && buttons.right == false && buttons.top == false && buttons.bottom == false) {
        sensorblock = false;
    } else {
        sensorblock = true;
    }
    if (cursorposset == false && downmouse == true) {
        xcenter = mouseX;
        ycenter = mouseY;
        let obj_point = document.querySelector(".touchpoint");
        obj_point.style.left = `${mouseX - 15}px`;
        obj_point.style.top = `${mouseY - 15}px`;
        obj_point.style.display = "flex";
        cursorposset = true; 
    }
    if (gamestart == true && cursorposset == true && downmouse == true && sensorblock == false) {
        player_changes("pos");
        let ybust = Math.abs((ycenter - mouseY) / ycenter) * 5;
        if (ybust > 1) {
            ybust = 1;
        }
        let xbust = Math.abs((xcenter - mouseX) / xcenter) * 5;
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

function addBoost(id, name, time, power) {
    if (gamestart) {
        if (id == 0) {
            if (JSON.parse(localStorage.getItem('boosts'))[0] > 0) {
                let x = JSON.parse(localStorage.getItem('boosts'));
                x[0] -= 1;
                localStorage.setItem('boosts', JSON.stringify(x));
                player.boost[0] = {name: name, time: time, power: power};
                player.viewupdate();
                scoreupdate();
                showmessage('Вы применили "Скорость 2Х"');
            }
        }
    }
}
function buyBoost(id) {
    if (id == 1) {
        if (Number(localStorage.getItem('sumscore')) >= 200) {
            let x = JSON.parse(localStorage.getItem('boosts'));
            x[0] += 1;
            localStorage.setItem('boosts', JSON.stringify(x));
            localStorage.setItem('sumscore', Number(localStorage.getItem('sumscore')) - 200);
        }
    }
    scoreupdate();
}

function checkentity() {
    let var_scale_offsetX = ((clWidth / scale) - clWidth) / 2;
    let var_scale_offsetY = ((clHeight / scale) - clHeight) / 2;
    for (let x = 0; x < entity.length; x++) {
        if (entity[x]) {
            entity[x].update();
            let this_obj = document.querySelector(`.entity.id-${entity[x].id + 1}`);
            if (this_obj) {
                if (entity[x].posx + entity[x].size / 2 + offsetX > 0 - var_scale_offsetX && entity[x].posx - entity[x].size / 2 + offsetX < clWidth + var_scale_offsetX && entity[x].posy + entity[x].size / 2 + offsetY > 0 - var_scale_offsetY && entity[x].posy - entity[x].size + offsetY < clHeight + var_scale_offsetY) {
                    if (this_obj.hidden == true) {
                        this_obj.hidden = false;
                    }
                } else {
                    if (this_obj.hidden == false) {
                        this_obj.hidden = true;
                    }
                }
            }
        }
    }
    for (let x = 0; x < drops.length; x++) {
        if (drops[x]) {
            if (document.querySelector(`.drop.id-${drops[x].id + 1}`)) {
                let this_obj = document.querySelector(`.drop.id-${drops[x].id + 1}`);
                if (drops[x].posx + drops[x].size / 2 + offsetX > -50 - var_scale_offsetX && drops[x].posx - drops[x].size / 2 + offsetX < clWidth + var_scale_offsetX + 50 && drops[x].posy + drops[x].size / 2 + offsetY > -50 - var_scale_offsetY && drops[x].posy - drops[x].size + offsetY < clHeight + var_scale_offsetY) {
                    if (this_obj.hidden == true) {
                        this_obj.hidden = false;
                    }
                } else {
                    if (this_obj.hidden == false) {
                        this_obj.hidden = true;
                    }
                }
            }
            drops[x].update();
        }
    }
    for (let x = 0; x < ghosts.length; x++) {
        if (ghosts[x]) {
            ghosts[x].update();
            let this_obj = document.querySelector(`.ghost.id-${ghosts[x].id + 1}`);
            if (this_obj) {
                if (ghosts[x].posx + ghosts[x].size / 2 + offsetX > 0 - var_scale_offsetX && ghosts[x].posx - ghosts[x].size / 2 + offsetX < clWidth + var_scale_offsetX && ghosts[x].posy + ghosts[x].size / 2 + offsetY > 0 - var_scale_offsetY && ghosts[x].posy - ghosts[x].size + offsetY < clHeight + var_scale_offsetY) {
                    if (this_obj.hidden == true) {
                        this_obj.hidden = false;
                    }
                } else {
                    if (this_obj.hidden == false) {
                        this_obj.hidden = true;
                    }
                }
            }
        }
    }
    if (!document.querySelector("#player")) {
        playerlive = false; 
        player.size = 30;
    } else {
        playerlive = true;
    }
    
}

function movePlayer() {
    if (buttons.left || buttons.right || buttons.top || buttons.bottom) {
        player_changes("pos");
    }
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

    offsetX = (clWidth + ((clWidth / scale) - clWidth)) / 2 - player.posx; 
    offsetY = (clHeight / 2) - player.posy;
}

function leaderboard_update() {
    let mas = [];
    let finalmas = [];
    let thisid;
    for (let x = 0; x < entity.length; x++) {
        if (entity[x]) {
            mas.push({"size": entity[x].size, "name": entity[x].name, "score": entity[x].score, "isghost": entity[x].isghost});
        }
    }
    for (let y = 0; y < mas.length; y++) { 
        let max = 0;
        for (let x = 0; x < mas.length; x++) {
            if (mas[x] && mas[x].size > max) {
                max = mas[x].size;
                thisid = x;
            }
        }
        finalmas[y] = mas[thisid];
        delete mas[thisid];
    }
    let obj_ul = document.querySelector(".leaderboard ul");
    obj_ul.querySelectorAll("li").forEach(function(obj_l) {
        obj_ul.removeChild(obj_l);
    })
    let obj_li;
    for (let x = 0; x < 6 && x < finalmas.length; x++) {
        obj_li = document.createElement("li");
        obj_li.textContent = `${finalmas[x].name} - ${Math.round(finalmas[x].size)} [${Math.round(finalmas[x].score)}]`
        if (finalmas[x].isghost == true) {
            obj_li.classList.add("ghost-text");
        }
        obj_ul.append(obj_li);
    }
    obj_li = document.createElement("li");
    obj_li.classList.add("thisplayer");
    obj_li.textContent = `${player.name} - ${Math.round(player.size)} силы. Всего ${Math.round(player.score)} очков`;
    obj_ul.append(obj_li);
    //resultul += `<li style="border-top: 2px solid white; padding-top: 10px">${player.name} - ${Math.round(player.size)} силы. <br>Всего ${Math.round(player.score)} очков</li>`
    //document.querySelector(".leaderboard ul").innerHTML = resultul;
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
function player_changes(typechange) {
    if (typechange == "pos" || typechange == "size") {
        gamecontainer_control();
    }
}

document.body.addEventListener("mouseup", function(click) {
    downmouse = false;
    cursorposset = false;
    document.querySelector(".touchpoint").style.display = "none";
})

document.body.addEventListener("mousedown", function(click) {
    downmouse = true;
    mouseX = click.clientX;
    mouseY = click.clientY;
})
let mousetick = 0;
document.body.addEventListener("mousemove", function(move) {
    mouseX = move.clientX;
    mouseY = move.clientY;
})
document.querySelector("#game").addEventListener("touchmove", function(move) {
    downmouse = true;
    mouseX = move.touches[0].screenX;
    mouseY = move.touches[0].screenY;
})
document.body.addEventListener("touchend", function(move) {
    downmouse = false;
    cursorposset = false;
    document.querySelector(".touchpoint").style.display = "none";
})

function startgame() {
    let player_obj = document.querySelector(`.entity.id-${this.id}`);
            //player_obj.style.left = `${(clWidth + ((clWidth / scale) - clWidth)) / 2 - player_obj.clientWidth / 2}px`;
            //(clWidth + ((clWidth / scale) - clWidth)) / 2 - player_obj.clientWidth / 2
    offsetX = (clWidth + ((clWidth / scale) - clWidth)) / 2 - player.posx; 
    offsetY = (clHeight / 2) - player.posy;
    document.querySelector(".game__border, #player, .leaderboard").style.display = "flex";
    document.querySelector(".game__menu, .leave").style.display = "none";
    player.viewupdate();
    border_control();
    gamecontainer_control();
    if (audioactive == false) {
        audio1.play();
        audio1.volume = 0.7;
        audioactive = true;
        audio1.currentTime = 1;
    }
    leaderboard_update();
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
function scoreupdate() {
    if (!localStorage.getItem('sumscore')) {
        localStorage.setItem('sumscore', 0);
    }
    if (!localStorage.getItem('boosts')) {
        localStorage.setItem('boosts', "[0]");
    }
    document.querySelector(".boostlist .boost_1__count").textContent = JSON.parse(localStorage.getItem('boosts'))[0];
    if (JSON.parse(localStorage.getItem('boosts'))[0] == 0) {
        document.querySelector(".boostlist .boost_1").classList.add("nostock");
    } else {
        document.querySelector(".boostlist .boost_1").classList.remove("nostock");
    }
    document.querySelector(".button.bal p").textContent = `- ${Math.round(localStorage.getItem('sumscore'))} очков`;
}
function stopgame() {
    document.querySelector(".menu__header h2").innerHTML = `PackMan.io - ${getRandTitle()}`;
    document.querySelector(".game__border, .leaderboard").style.display = "none";
    document.querySelector(".leave").style.display = "none";
    document.querySelector(".game__menu").style.display = "flex";
    document.querySelector("#game").style.filter = "none";
    if (document.querySelector("#player")) {
        document.querySelector("#player").style.display = "none";
    }
    document.querySelectorAll(".entity, .drop, .ghost").forEach(function(en) {
        en.outerHTML = "";
    })
    
    scoreupdate();
}
stopgame();

function sss() {
    gamestart = false;
}

function update() {
    if (gamestart) {
        movePlayer();
        checkentity();
        checksensor();
    }
    if (playerlive == false && gamestart == true) {
        document.querySelector(".leave").style.display = "flex";
    }
}

function nickgen() { // генерация ников
    let nick = "";
    let random;
    let maxact = Math.round(Math.random() * 2 + 2)
    for (let act = 0; act < maxact; act++) {
        random = Math.round(Math.random() * 36);
        if (act < maxact - 1) {
            switch (random) {
                case 0: nick += "zig"; break;
                case 1: nick += "jo"; break;
                case 2: nick += "tan"; break;
                case 3: nick += "sa"; break;
                case 4: nick += "na"; break;
                case 5: nick += "nik"; break;
                case 6: nick += "ni"; break;
                case 7: nick += "vi"; break;
                case 8: nick += "ke"; break;
                case 9: nick += "mi"; break;
                case 10: nick += "ge"; break;
                case 11: nick += "ji"; break;
                case 12: nick += "zi"; break;
                case 13: nick += "ha"; break;
                case 14: nick += "be"; break;
                case 15: nick += "oxy"; break;
                case 16: nick += "tro"; break;
                case 17: nick += "fe"; break;
                case 18: nick += "ar"; break;
                case 19: nick += "iv"; break;
                case 20: nick += "a"; break;
                case 21: nick += "e"; break;
                case 22: nick += "u"; break;
                case 23: nick += "ru"; break;
                case 24: nick += "su"; break;
                case 25: nick += "x"; break;
                case 26: nick += "pa"; break;
                case 27: nick += "ro"; break;
                case 28: nick += "go"; break;
                case 29: nick += "mi"; break;
                case 30: nick += "un"; break;
                case 31: nick += "mar"; break;
                case 32: nick += "vla"; break;
                case 33: nick += "den"; break;
                case 34: nick += "dan"; break;
                case 35: nick += "ker"; break;
                case 36: nick += "an"; break;
            }
        } else {
            switch (random) {
                case 0: nick += "ik"; break;
                case 1: nick += "zik"; break;
                case 2: nick += "fik"; break;
                case 3: nick += "to"; break;
                case 4: nick += "dik"; break;
                case 5: nick += "ov"; break;
                case 6: nick += "ske"; break;
                case 7: nick += String(Math.round(Math.random() * 100)); break;
                case 8: nick += String(Math.round(Math.random() * 100)); break;
                case 9: nick += "ro"; break;
                case 10: nick += "ji"; break;
                case 11: nick += "jo"; break;
                case 12: nick += "ku"; break;
                case 13: nick += "ma"; break;
                case 14: nick += "rd"; break;
                case 15: nick += String(Math.round(Math.random() * 1) + 23); break;
                case 16: nick += "av"; break;
                case 17: nick += "ad"; break;
                case 18: nick += "gon"; break;
                case 19: nick += "di"; break;
                case 20: nick += "vs"; break;
                case 21: nick += "lon"; break;
                case 22: nick += "ru"; break;
                case 23: nick += "de"; break;
                case 24: nick += "sa"; break;
                case 25: nick += "vi"; break;
                case 26: nick += "ve"; break;
                case 27: nick += "io"; break;
                case 28: nick += "ne"; break;
                case 29: nick += "ru"; break;
                case 30: nick += "ti"; break;
                case 31: nick += "chik"; break;
                case 32: nick += "ba"; break;
                case 33: nick += "mir"; break;
                case 34: nick += "di"; break;
                case 35: nick += "_"; break;
                case 36: nick += "lina"; break;
            }
            if (random * Math.random() > 10) {
                nick += String(Math.round(Math.random() * 100));
            }
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
        let obj_drop = document.createElement("div");
        obj_drop.classList.add('drop', `id-${y + 1}`, `type-${drops[y].type}`);
        document.querySelector(".game__area").append(obj_drop);
        obj_drop.style.left = `${drops[y].posx - drops[y].size / 2}px`;
        obj_drop.style.top = `${drops[y].posy - drops[y].size / 2}px`;
    }
}

function botgen() { // Генерация ботов
    if (gamestart == true) {
        let maxp = 0;
        for (let x = 0; x < entity.length; x++) {
            if (entity[x]) {
                maxp++;
            }
        }
        if (maxp < 20) {
            let obj_packman = document.createElement("div");
            obj_packman.classList.add(`packman`, `bot`, `entity`, `id-${entity.length + 1}`);
            document.querySelector(".game__area").append(obj_packman);
            entity.push(new Packman(entity.length + 1, Math.random() * borderwidth - borderwidth / 2, Math.random() * borderheight - borderheight / 2, "bot", nickgen()));
            obj_packman.style.left = `${entity[entity.length - 1].posx - entity[entity.length - 1].size / 2}px`;
            obj_packman.style.top = `${entity[entity.length - 1].posy - entity[entity.length - 1].size / 2}px`;
            leaderboard_update();
        }
    }
}

function ghostgen() { // Генерация призраков
    if (gamestart == true) {
        let obj_ghost = document.createElement("div");
        obj_ghost.classList.add("ghost", `id-${ghosts.length + 1}`);
        document.querySelector(".game__area").append(obj_ghost);
        ghosts.push(new Ghost());
        obj_ghost.style.left = `${ghosts[ghosts.length - 1].posx - ghosts[ghosts.length - 1].size / 2}px`;
        obj_ghost.style.top = `${ghosts[ghosts.length - 1].posy - ghosts[ghosts.length - 1].size / 2}px`;
    }
}

setInterval(() => { // интервалы исполнения разных функций
    botgen();
    if (audio1.currentTime == audio1.duration) {
        audio1.play();
    }
}, 5000);
setInterval(update, 40);
setInterval(dropgen, 120);
setInterval(ghostgen, 17000);

function displaymove() {
    clWidth = document.body.clientWidth;
    clHeight = document.body.clientHeight;
    let obj_pl = document.querySelector("#player");
    obj_pl.style.left = clWidth / 2  + "px";
    obj_pl.style.top = clHeight / 2 - 25 + "px";
}

function showmessage(message) {
    let obj_mess = document.querySelector(".message__bar")
    obj_mess.textContent = message;
    obj_mess.style.opacity = 0.7;
    setTimeout(() => {
        if (obj_mess.style.opacity == 0.7) {
            obj_mess.style.opacity = 0;
        }
    }, 3000);
}

window.addEventListener("resize", function() {
    displaymove();
})

document.querySelector("#gamestart").addEventListener("click", function() {
    gamestart = true;
    document.querySelector(".game__container").innerHTML += '<div class="packman player entity id-1" id="player"></div>';
    if (!changename) {
        changename = nickgen();
    }
    player = new Packman(1, 0, 50, "Xplayer", changename);
    player.viewupdate();
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
document.addEventListener("keydown", function(e) {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        e.preventDefault();
    }
})
document.querySelector("#name").addEventListener("keydown", function(a) {
    if (gamestart == false && a.key == "Enter") {
        changename = document.querySelector('#name').value;
    }
})
document.querySelector(".page.learn").addEventListener("click", function() {
    document.querySelector(".page.info").style.display = "flex";
})
document.querySelector(".page.info .button").addEventListener("click", function() {
    document.querySelector(".page.info").style.display = "none";
})

function vksub() {
    vkBridge.send("VKWebAppJoinGroup", {group_id: 217181628})
    .then((data) => { 
      if (data.result) {
        document.querySelector(".vk__sub .vk__button__left").classList.add("active");
      }
    })
    .catch((error) => {
      // Ошибка
      document.querySelector(".vk__sub .vk__button__left").classList.remove("active");
    }); 
}
function vkshar() {
    vkBridge.send('VKWebAppShare', {link: 'https://vk.com/app51676673'});
    document.querySelector(".vk__send .vk__button__left").classList.add("active");
}