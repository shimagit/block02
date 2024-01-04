"use strict"

class Rectangle
{
  constructor( x, y, width, height)
  {
    this.mWidth = width;
    this.mHeight = height;
  }

  contains( x, y )
  {
    return( this.mX <= x && x < this.mX + this.mWidth &&
            this.mY <= y && y < this.mY + this.mHeight );
  }
  
  get pCX()
  {
    return( this.mX + this.mWidth / 2 );
  }
  set pCX( value )
  {
    this.mX = value - this.mWidth / 2;
  }

  get pCY()
  {
    return( this.mY + this.mHeight / 2 );
  }
  set pCY( value )
  {
    this.mY = value - this.mHeight / 2;
  }
}

const COLUMN = 14;
const ROW = 6;
const MAG = 3;
const MAP_WIDTH = 30;
const MAP_HEIGHT = 23;
const MESH = 8;
const WIDTH = 240;
const HEIGHT = 180;

var gCanvas = [];
var gChange;
var gImg;
var gLife = 3;
var gScore = 0;
var gStage = 0;
var gMap;
var gSE = [];

class Player extends Rectangle
{
  constructor()
  {
    super( 0, 0, MESH * 2, MESH );
  }

  draw( g )
  {
    DrawBlock( g, this.mX, this.mY, "#00ffff");
  }

  start()
  {
    this.pCX = WIDTH / 2;
    this.pCY = HEIGHT - MESH * 2;
  }

  tick()
  {
    this.mX = Math.max( MESH             , this.mX - gKey[ 37 ] * MAG * 4 );
    this.mX = Math.min( WIDTH - MESH * 2 , this.mX + gKey[ 39 ] * MAG * 4 );
    // this.mY = Math.max( MESH             , this.mY - gKey[ 38 ] * MAG * 2 );
    // this.mY = Math.min( HEIGHT - MESH * 2, this.mY + gKey[ 40 ] * MAG * 2 );
  }
}

var gPlayer = new Player();

function draw()
{
  if( gChange){
    gChange = false;
    let g = gCanvas[ 0 ].getContext( "2d" );
    for( let y = 0; y < MAP_HEIGHT; y++ ){
      for( let x = 0; x < MAP_WIDTH; x++ ){
        g.drawImage( gImg, gMap[ y * MAP_WIDTH + x ] * MESH, 0, MESH, MESH, x * MESH, y * MESH, MESH, MESH );
      }
    }
  }
    
  let g = document.getElementById("main").getContext("2d");
  g.imageSmoothingEnabled = g.msUmageSmoothEnabled = false;
  g.drawImage( gCanvas[ 0 ], 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH * MAG, HEIGHT * MAG );

  g.font = "bold " + MESH * MAG + "px monospace";
  g.fillStyle = "#ff2200";
  g.fillText("SCORE", MESH * MAG * 2, MESH * MAG * 1.8 );
  g.fillText("SCORE", MESH * MAG * 2 + 1, MESH * MAG * 1.8 );
  g.fillText("LIFE", MESH * MAG * 13, MESH * MAG * 1.8 );
  g.fillText("LIFE", MESH * MAG * 13 + 1, MESH * MAG * 1.8 );
  g.fillText("STAGE", MESH * MAG * 23, MESH * MAG * 1.8 );
  g.fillText("STAGE", MESH * MAG * 23 + 1, MESH * MAG * 1.8 );

  g.fillStyle = "#ffffff";
  g.fillText(""+ gScore, MESH * MAG * 6.5, MESH * MAG * 2.8 );
  g.fillText(""+ gLife, MESH * MAG * 16.5, MESH * MAG * 2.8 );
  g.fillText(""+ gStage, MESH * MAG * 27.5, MESH * MAG * 2.8 );

  if( gLife <= 0) {
    g.fillText("GAME OVER", WIDTH * MAG / 2 - MESH * MAG * 4, HEIGHT * MAG / 2 + MESH * MAG );
  }
  
  if( gScore == COLUMN * ROW * gStage ) {
    g.fillText("GAME CLEAR!", WIDTH * MAG / 2 - MESH * MAG * 5, HEIGHT * MAG / 2 + MESH * MAG );
  }
}

function nextStage()
{
  gStage++;
  gChange = true;
  gMap =[
		5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,18, 3,
		3,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12, 3,
		3,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16, 3,
		3, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 3,
		3,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14, 3,
		3, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 9,10, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
		3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3,
		3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
	];
}

function start()
{
  gCanvas[ 0 ] = document.createElement( "canvas" );
  gCanvas[ 0 ].width = WIDTH;
  gCanvas[ 0 ].height = HEIGHT;

  gCanvas[ 1 ] = document.createElement( "canvas" );
  gCanvas[ 1 ].width = WIDTH;
  gCanvas[ 1 ].height = HEIGHT;

  nextStage();

  let s = [ "se1.mp3", "se2.mp3", "se3.mp3" ];
  for( let i = 0; i < s.length; i++){
    gSE[ i ] = new Audio();
    gSE[ i ].volume = 0.1;
    gSE[ i ].src = s[ i ];;
  }

  
  gImg = new Image();
  gImg.src = "tile.png";
  gImg.onload = function()
  {
    requestAnimationFrame( onPaint );
  }

}

function tick()
{
}

// =================== 03_B¥breakout2 ====================

const TIMER_INTERVAL = 33;

var gKey = new Uint8Array( 0x100 );
var gTimer;


// 描画イベント
function onPaint()
{
  if( !gTimer ){
    gTimer = performance.now();
  }

  if( gTimer + TIMER_INTERVAL < performance.now() ){
    gTimer += TIMER_INTERVAL;
    tick();
    draw();
  }
  requestAnimationFrame( onPaint );
}

// キーを押した時のイベント
window.onkeydown = function(ev)
{
  gKey[ ev.keyCode ] = 1;
}

// キーを離した時のイベント
window.onkeyup = function(ev)
{
  gKey[ ev.keyCode ] = 0;
}

// 起動時のイベント
window.onload = function()
{
  start();
}