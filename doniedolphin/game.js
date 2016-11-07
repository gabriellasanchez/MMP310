//http:createjs.com/TweenJS/demos/sparkTable.html
//http:createjs.com/Docs/TweenJS/modules/TweenJS.html
//http:createjs.com/Demos/EaselJS/Game.html 
var stage, w, h, loader, wave1height, wave2height, wave3height, startX, startY, wiggleDelta;
var background, dolphin, ground, wave, bottomWave, waves, rotationDelta, counter, counterOutline;
var started = false; 
var startJump = false; 

var jumpAmount = 120; 
var jumpTime = 266;

var dead = false;
var KEYCODE_SPACE = 32;     
var gap = 250;
var masterWaveDelay = 78; 
var waveDelay = masterWaveDelay; 

var counterShow = false;

document.onkeydown = handleKeyDown;

function init() {
if (window.top != window) {
//document.getElementById("header").style.display = "none";
}


createjs.MotionGuidePlugin.install();

stage = new createjs.Stage("testCanvas");

createjs.Touch.enable(stage);
// stage.canvas.width = document.body.clientWidth; //document.width is obsolete
// stage.canvas.height = document.body.clientHeight; //document.height is obsolete

// grab canvas width and height for later calculations:
w = stage.canvas.width;
h = stage.canvas.height;

manifest = [
{src:"images/dolph.png", id:"dolphin"},
{src:"images/sun.png", id:"background"},
{src:"images/ground.jpg", id:"ground"},
{src:"http://www.appcycle.me/flappy/img/restart.png", id:"start"},
{src:"http://www.appcycle.me/flappy/img/share.png", id:"share"},
{src:"images/toxic-waste.jpg", id:"wave"},

];

loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", handleComplete);
loader.loadManifest(manifest);
}

function handleComplete() {

background = new createjs.Shape();
background.graphics.beginBitmapFill(loader.getResult("background")).drawRect(0,0,w,h);

var groundImg = loader.getResult("ground");
ground = new createjs.Shape();
ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w+groundImg.width, groundImg.height);
ground.tileW = groundImg.width;
ground.y = h-groundImg.height;


var data = new createjs.SpriteSheet({
"images": [loader.getResult("dolphin")],
"frames": {"width": 105, "height": 95, "regX": 40, "regY": 30, "count": 3}, 
"animations": {"fly": [0, 2, "fly", 0.21], "dive": [1, 1, "dive", 1]}
});
dolphin = new createjs.Sprite(data, "fly");

startX = (w/2) - (92/2)
startY = 490
wiggleDelta = 18

// Set initial position and scale 1 to 1
dolphin.setTransform(startX, startY, 1, 1);
// Set framerate
dolphin.framerate = 30;

createjs.Tween.get(dolphin, {loop:true}).to({y:startY + wiggleDelta}, 380, createjs.Ease.sineInOut).to({y:startY}, 380, createjs.Ease.sineInOut);

stage.addChild(background);

waves = new createjs.Container(); 
stage.addChild(wave);

stage.addChild(dolphin, ground);
stage.addEventListener("stagemousedown", handleJumpStart);

counter = new createjs.Text(0, "86px 'Donie Dolphin'", "#ffffff");
counterOutline = new createjs.Text(0, "86px 'Donie Dolphin'", "#000000");
counterOutline.outline = 5
counterOutline.textAlign = 'center'
counter.textAlign = 'center'
counterOutline.x = w/2
counterOutline.y = 150
counter.x = w/2
counter.y = 150
counter.alpha = 1
counterOutline.alpha = 1
stage.addChild(counter, counterOutline)

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener("tick", tick);


}

function handleKeyDown(e) {
//cross browser issues exist
if(!e){ var e = window.event; }
switch(e.keyCode) {
case KEYCODE_SPACE: handleJumpStart();
}
}

function handleJumpStart() {
if (!dead) {
createjs.Tween.removeTweens ( dolphin )
dolphin.gotoAndPlay("jump");
startJump = true
if (!started) {
started = true
counterShow = true                        
}
}
}

function diveDolphin() {
dolphin.gotoAndPlay("dive");
}

function restart() {

waves.removeAllChildren();
createjs.Tween.get(start).to({y:start.y + 10}, 50).call(removeStart);
counter.text = 0;
counterOutline.text = 0;
counterOutline.alpha = 0;
counter.alpha = 0;
counterShow = false;
waveDelay = masterWaveDelay;
dead = false;
started = false;
startJump = false;
createjs.Tween.removeTweens ( dolphin );
dolphin.x = startX;
dolphin.y = startY;
dolphin.rotation = 0;
createjs.Tween.get(dolphin, {loop:true}).to({y:startY + wiggleDelta}, 380, createjs.Ease.sineInOut).to({y:startY}, 380, createjs.Ease.sineInOut);
}

function die() {
dead = true;
dolphin.gotoAndPlay("dive");
createjs.Tween.removeTweens ( dolphin );
createjs.Tween.get(dolphin).wait(0).to({y:dolphin.y + 200, rotation: 90}, (380)/1.5, createjs.Ease.linear) 
.call(diveDolphin) 
.to({y:ground.y - 30}, (h - (waves.y+200))/1.5, createjs.Ease.linear); //falls
createjs.Tween.get(stage).to({alpha:0}, 100).to({alpha:1}, 100)
}
/*

COmmented out the Start and Share button for now

start = new createjs.Bitmap(loader.getResult("start"));
start.alpha = 0
start.x = w/2 - start.image.width/2
start.y = h/2 - start.image.height/2 - 150
//share = new /*createjs.Bitmap(loader.getResult("share"));
share.alpha = 0
share.x = w/2 - share.image.width/2
share.y = h/2 - share.image.height/2 - 50*/

//stage.addChild(start)
//stage.addChild(share)
/*createjs.Tween.get(start).to({alpha:1, y: start.y + 50}, 400, createjs.Ease.sineIn).call(addClickToStart)
createjs.Tween.get(share).to({alpha:1, y: share.y + 50}, 400, createjs.Ease.sineIn).call(addClickToStart)*/

//}
/*function removeStart() {
stage.removeChild(start)
stage.removeChild(share)
}
function addClickToStart() {
start.addEventListener("click", restart);
share.addEventListener("click", goShare);
}

function goShare() {
var countText
if (counter.text == 1) {
countText = "1 point"
} else {
countText = counter.text + " points"
}
window.open("https://twitter.com/share?url=http%3A%2F%2Fappcycle.me/flappy&text=I scored " + countText +  " on HTML5 Flappy Bird.");
}*/

/* Tick event is to trigger counter and waves however I cannot see them?*/

function tick(event) {
var deltaS = event.delta/1000;

var l = waves.getNumChildren();

if (dolphin.y > (ground.y - 40)) {
if (!dead) {
die()
}
if (dolphin.y > (ground.y - 30)) {
createjs.Tween.removeTweens ( dolphin )
}
}

if (!dead) {
ground.x = (ground.x-deltaS*300) % ground.tileW;
}


if (started && !dead) {
if (waveDelay == 0) {

/*
This code doesn't work

this.waves = game.add.group();
addOneWave: function(x, y){
    var wave = game.add.sprite(x, y, 'wave');
    this.waves.add(wave);
    game.physics.arcade.enable(wave);
    wave.body.velocity.x = -200;
    wave.checkWorldBounds = true;
    wave.outofBoundsKill = true;
},
addRowofWaves: function(){
    var hold = Math.floor(Math.random()*5)+1;
    for(var i = 0; i < 8; i++)
        if(1 != hole && i != hole +1)
            this.addOneWave(400, 1 * 60 + 10);
} */   
wave = new createjs.Bitmap(loader.getResult("wave"));
wave.x = w-500
wave.y = (ground.y - gap*2) * Math.random() + gap*1.5
waves.addChild(wave);
createjs.Tween.get(wave).to({x:100 - wave.image.width}, 5000)
console.log(wave.x + " " + wave.y)

/*
Second round of waves not needed

wave2 = new createjs.Bitmap(loader.getResult("wave"));
wave2.scaleX = -1
wave2.rotation = 180
wave2.x = wave.x //+ wave.image.width
wave2.y = wave.y - gap
createjs.Tween.get(wave2).to({x:0 - wave.image.width}, 5100)

waves.addChild(wave2);*/

waveDelay = masterWaveDelay

} else {
waveDelay = waveDelay - 1
}
for(var i = 0; i < l; i++) {
wave = waves.getChildAt(i);
if (wave) {
    if (true) { // tried replacing true with this, but it's off: wave.x < dolphin.x + 92 && wave.x > wave.x 
        var collision = ndgmr.checkRectCollision(wave,dolphin,1,true)
        if (collision) {
            if (collision.width > 8 && collision.height > 8) {
                die()
            }
        }
    }
    wave.x = (wave.x - deltaS*300);
    if (wave.x <= 338 && wave.rotation == 0 && wave.name != "counted") {
        wave.name = "counted" //using the wave name to count wave
        counter.text = counter.text + 1
        counterOutline.text = counterOutline.text + 1
    }
    if (wave.x + wave.image.width <= -wave.w) { 
        waves.removeChild(wave)
    }
}
}
if (counterShow) {
counter.alpha = 1
counterOutline.alpha = 1
counterShow = false
}

}



if (startJump == true) {
startJump = false
dolphin.framerate = 60;
dolphin.gotoAndPlay("fly");
if (dolphin.roation < 0) {
rotationDelta = (-dolphin.rotation - 20)/5
} else {
rotationDelta = (dolphin.rotation + 20)/5
}
if (dolphin.y < -200) {
dolphin.y = -200
}
createjs
.Tween
.get(dolphin)
.to({y:dolphin.y - rotationDelta, rotation: -20}, rotationDelta, createjs.Ease.linear) 
.to({y:dolphin.y - jumpAmount, rotation: -20}, jumpTime - rotationDelta, createjs.Ease.quadOut) 
.to({y:dolphin.y}, jumpTime, createjs.Ease.quadIn)  
.to({y:dolphin.y + 200, rotation: 90}, (380)/1.5, createjs.Ease.linear) 
.call(diveDolphin) 
.to({y:ground.y - 30}, (h - (dolphin.y+200))/1.5, createjs.Ease.linear); 
}


stage.update(event);
}