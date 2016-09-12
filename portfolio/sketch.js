var img;

function preload() {
    img = loadImage("blackhole.jpg");
}

function setup() {
    createCanvas(640, 480);
    background(255);
    image(img, 0, 0, 640, 480);
    ellipseMode(CENTER);
    rectMode(CENTER);
}

function draw() {
    stroke(0);
    fill(0,0,400);
    rect(240,145,60,100);
    
    line(220,170,200,190);
    
    line(260,170,280,190);
    
    fill(255,240,240);
    ellipse(240,115,100,100);
    
    arc(240,120,80,80,0,PI);
    
    fill(0);
    ellipse(221,115,16,32);
    ellipse(259,115,16,32);
    
    stroke(0);
    line(230,195,220,220);
    line(250,195,260,220);    
        
}

    