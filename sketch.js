/* The Final Game Project 

My first extension was the advanced graphics. I wanted to make my game look a bit and I wanted to practice using colour in a better way than I did so far. The bits I found more difficult was implementing the gradient colouring. In CSS it is easier to implement gradient colours, but in p5.js it needed quite some investigation and trial from my side to apply exactly what I had in mind. While searching, I discovered lerpColor(), which helped me blend the colours in a smooth way, by integrating this in functions. After I figured out how to create linear gradient effect which I used for my sunset sky and ground, I experimented on how to apply this for my setting sun. It took a lot of trial and error, but I then figured it out. Apart from the gradient colour effects, I also practised a lot and learned how to draw and create arrays by utilising for loops, instead or repeating the same code many times. This helped me create some sort of depth in my game as well, by adding background and front mountains and clouds, without having to write much more code.

My second extension was the sound. I wanted to make the game a bit more interesting and sound adds a lot in video games. What I found difficult using the sound was debugging my code. At first not all sound effects were working and dI had to try out a couple of different things to make them work in the game. Then the problem was that the sounds were working but playing in a loop in some cases so I had to find the specific areas I needed to add some more commands to control that from happening. What I definitely learned from using and practising with sound was debugging, using the Console.log() to isolate the area of the 'problem' and then fix it by testing and trying. In the end I made all sounds work correctly and without any loops, so I was very happy about this.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var treePos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var trees;
var background_clouds;
var front_clouds;
var background_mountains;
var front_mountains;
var collectables;
var canyons;
var platforms;

var game_score;
var flagpole;
var lives;
var incr_trees;
var incr_clouds;
var incr_mountains;

var color1, color2, color3, color4, color5, color6, color7, color8, color9, color10;

var jumpSound;
var fallSound;
var gameOverSound;
var dingSound;
var myBackgroundSound;
var gameCompletedSound;
var gameOver;
var gameOverSoundisPlaying;

function preload()
{
    soundFormats('mp3','wav');
	
	jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
	
	fallSound = loadSound('assets/fall.wav');
	fallSound.setVolume(0.1);
	
	gameOverSound = loadSound('assets/game_over.wav');
	gameOverSound.setVolume(0.3);
	
	dingSound = loadSound('assets/ding.wav');
    dingSound.setVolume(0.2);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	
	startGame();
}

function startGame()
{
	myBackgroundSound = loadSound('assets/game_theme.wav', loaded);
	gameCompletedSound = loadSound('assets/game_complete.wav');
	
	if(lives == 0)
	{
		lives = 3;
	}
	gameChar_x = width/7;
	gameChar_y = floorPos_y;
	
	color1 = color(204,204,255);
	color2 = color(255,102,102);
	color3 = color(50,153,80);
	color4 = color(51, 55,0);
	color5 = color(255, 163, 153);
	color6 = color(255, 220, 153);
	color7 = color(140, 140, 140);
	color8 = color(100, 100, 100);
	color9 = color(101, 81, 101);
	color10 = color(134, 108, 134);

	scrollPos = 0;

	gameChar_world_x = gameChar_x - scrollPos;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	isContact = false;
	gameOver = false;
	gameOverSoundisPlaying = false;

	// Initialise arrays of scenery objects.
	trees = [];
	var incr_trees = (width + 5000)/70;
	for(var i=0; i<65; i++)
	{
		var tree = {x_pos: - 300 + incr_trees*i + random (-25, 25), 
					y_pos: random(300,440), 
					size: random(10,15)};
		trees.push(tree);
	}
	
	collectables = [
		{x_pos: 180, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 490, y_pos: floorPos_y - 125, size: 50, isFound: false},
		{x_pos: 710, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 850, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 1050, y_pos: floorPos_y - 100, size: 50, isFound: false},
		{x_pos: 1450, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 1580, y_pos: floorPos_y - 140, size: 50, isFound: false},
		{x_pos: 2000, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 2380, y_pos: floorPos_y - 130, size: 50, isFound: false},
		{x_pos: 2800, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 3080, y_pos: floorPos_y - 130 , size: 50, isFound: false},
		{x_pos: 3300, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 3600, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 4200, y_pos: floorPos_y - 10, size: 50, isFound: false},
		{x_pos: 4800, y_pos: floorPos_y - 10, size: 50, isFound: false},
		];
	
	canyons = [
		{x_pos: 250, width: 90},
		{x_pos: 620, width: 80},
		{x_pos: 1150, width: 100},
		{x_pos: 1700, width: 90},
		{x_pos: 2150, width: 80},
		{x_pos: 2650, width: 90},
		{x_pos: 3050, width: 100},
		{x_pos: 3750, width: 80},
		{x_pos: 4250, width: 180},
		];
	
	background_clouds = [];
	for(var i=0; i<12; i++)
	{
		var clr1 = random(229, 255);
		var cloud = {x_pos: 25 + (random(80,90))*i, 
					 y_pos: random(130,280), 
					 size: random(0.2,0.5), 
					 colour: color(clr1, 204, clr1, 240)};
		background_clouds.push(cloud);
	}
	
	front_clouds = [];
	var incr_clouds = (width + 3000)/20;
	for(var i=0; i<40; i++)
	{
		var clr1 = random(229, 204);
		var cloud = {x_pos: -350 + (random(incr_clouds - 3, incr_clouds + 3))*i, 
					 y_pos: random(50,130), 
					 size: random(0.6,1.1), 
					 colour: color(255, clr1, clr1, 230)};
		front_clouds.push(cloud);
	}
	
	background_mountains = [
		{x_pos: 30, y_pos: floorPos_y, size: 0.6, colour1: color7, colour2: color8},
		{x_pos: 210, y_pos: floorPos_y, size: 0.3, colour1: color7, colour2: color8},
		{x_pos: 390, y_pos: floorPos_y, size: 0.5, colour1: color7, colour2: color8},
		{x_pos: 520, y_pos: floorPos_y, size: 0.25, colour1: color7, colour2: color8},
		{x_pos: 760, y_pos: floorPos_y, size: 0.55, colour1: color7, colour2: color8},
		{x_pos: 920, y_pos: floorPos_y, size: 0.45, colour1: color7, colour2: color8}
		];
	
	front_mountains = [];
	var incr_mountains = (width + 3500)/20;
	for(var i=0; i < 30; i++)
	{
		var mountain = {x_pos: - 250 + incr_mountains*i + random(-15, 15), 
						y_pos: floorPos_y, 
						size: random(0.5,1), 
						colour1: color9,
						colour2: color10}
		front_mountains.push(mountain);
	}
	
	platforms = [];
	platforms.push(createPlatforms(460, floorPos_y - 115, 80));
	platforms.push(createPlatforms(1550, floorPos_y - 130, 80));
	platforms.push(createPlatforms(2350, floorPos_y - 115, 80));
	platforms.push(createPlatforms(3050, floorPos_y - 115, 80));
	platforms.push(createPlatforms(4250, floorPos_y - 115, 90));
	
	game_score = 0;
	
	flagpole = {isReached: false, x_pos: 5000};
}

function draw()
{
	// sunset sky
	setGradient(0, 0, width, height, color1, color2);
	
	//sunset
	sunGradient(630, floorPos_y, 150, 150, color5, color6);
	
	//underground
	fill(53, 17, 17);
	rect(-1,floorPos_y + 15, width, height/4);
	
	//underground spikes
	for(var i=0; i<width; i+=30)
	{
		noStroke();
		fill(102, 51, 0);
		triangle(i, height, i+30, height, i+5, height-20);
	}
	
	// draw gradient ground
	setGradient(0, floorPos_y, width, height/6, color3, color4, "Y");
	noStroke();
	
	// Draw backfround clouds
	drawClouds(background_clouds, color7, color8);
	
	// Draw background mountains
	drawMountains(background_mountains);
	
	
	push();
	translate(scrollPos, 0);

	// Draw clouds
	drawClouds(front_clouds);
	
	// Draw front mountains
	drawMountains(front_mountains);

	// Draw trees
	drawTrees();

	// Draw canyons
	for (var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	
	// Draw collectable items
	for(var i = 0; i < collectables.length; i++)
	{
		if (collectables[i].isFound == false)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}
	
	//Draw platforms
	for(var i=0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}
	
	renderFlagpole();

	pop();
	
	// Draw game character.
	drawGameChar();
	
	fill(255, 255, 204);
	strokeWeight(3);
	stroke(255, 153, 204);
	rect(8, 8, 105, 32, 12);
	rect(864, 8, 150, 32, 12);
	noStroke();
	textSize(20);
	textStyle(BOLD);
	fill(0, 51, 102);
	text('Score: ' + game_score, 17, 32);
	
	text('Lives: ', 875, 32);
	for(i=lives; i >= 0 ; i--)
	{
		if(lives > 0)
		{
			noStroke();
			fill(182, 4, 81);
			triangle(937, 23, 945, 32, 954, 23);
			ellipse(941, 21, 8.5, 8.5);
			ellipse(949, 21, 8.5, 8.5);
		}
		if(lives > 1)
		{
			noStroke();
			fill(182, 4, 81);
			triangle(962, 23, 970, 32, 978, 23);
			ellipse(966, 21, 8.5, 8.5);
			ellipse(974, 21, 8.5, 8.5);
		}
		if(lives > 2)
		{
			noStroke();
			fill(182, 4, 81);
			triangle(987, 23, 995, 32, 1004, 23);
			ellipse(991, 21, 8.5, 8.5);
			ellipse(999, 21, 8.5, 8.5);
		}
	}
	
	fill(0);
	if(lives < 1)
	{
		strokeWeight(5);
		stroke(204, 153, 255);
		textStyle(BOLD);
		textSize(80);
		text('Game over.', width/2 - 200, height/2 - 30);
		textSize(60);
		text('Press space to continue.', width/3 - 150, height/2 + 30);
		return;
	}
	
	if(flagpole.isReached == true)
	{
		strokeWeight(5);
		stroke(204, 153, 255);
		textStyle(BOLD);
		textSize(80);
		text('You Won!!!', width/2 - 200, height/2 - 30);
			textSize(50);
		text('Bamboo shoots are waiting for you!', width/3 - 260, height/2 + 30);
		myBackgroundSound.stop();
		return;
	}

	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 4;
		}
		else
		{
			scrollPos += 4;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 4;
		}
		else
		{
			scrollPos -= 4;
		}
	}

	// Logic to make the game character rise and fall.
	if (gameChar_y < floorPos_y)
	{
		var isContact = false;
		for(var i=0; i < platforms.length; i++)
		{
			if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
			{
				isContact = true; 
				isFalling = false;
//				gameChar_y = platforms[i].y; 
				break;
			}
		}
		if(isContact == false)
		{
			gameChar_y += 3 ;
			isFalling = true;
		}
	}
	else 
	{ 
		isFalling = false;    
	}
	
	// Logic to make the flag rise
	if(flagpole.isReached == false)
	{
		checkFlagpole();
	}
	
	checkPlayerDie();
	
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	
	if(key == 'A' || keyCode == 37)
	{
		isLeft = true;
	}

	if(key == 'D' || keyCode == 39)
	{
		isRight = true;
	}
	
	if((key == 'W' || keyCode == 32) && gameChar_y == floorPos_y)
    {
		gameChar_y -= 150;
		jumpSound.play();
    }
	
	if((key == 'W' || keyCode == 32) && gameOver)
    {
		gameOver = false;
		startGame();
    }
	
	if((key == 'W' || keyCode == 32) && flagpole.isReached)
    {
		flagpole.isReached = false;
		startGame();
    }
}

function keyReleased()
{
	if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	} 
	if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}
}

// ------------------------------
// Game character render function
// ------------------------------

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		//jumping-left code
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 73, 11, 11);
		strokeWeight(2);
		stroke(0);
		fill(255);
		rect(gameChar_x - 16, gameChar_y - 75, 32, 30, 13.5);
		fill(0);
		ellipse(gameChar_x + 11, gameChar_y - 73, 9, 9);
		//eyes
		fill(0);
		ellipse(gameChar_x - 7, gameChar_y - 63, 5, 5);
		ellipse(gameChar_x + 3, gameChar_y - 63, 5, 5);
		ellipse(gameChar_x - 9, gameChar_y - 60, 6, 8);
		ellipse(gameChar_x + 5, gameChar_y - 60, 6, 8);
		ellipse(gameChar_x - 3, gameChar_y - 54, 2, 2);
		ellipse(gameChar_x - 1, gameChar_y - 54, 2, 2);
		noStroke();
		fill(255);
		ellipse(gameChar_x - 6.5, gameChar_y - 61, 4, 4);
		ellipse(gameChar_x + 5.5, gameChar_y - 60.5, 4, 4);
		//body
		stroke(0);
		rect(gameChar_x - 18, gameChar_y - 45, 35, 34, 15);
		fill(0);
		ellipse(gameChar_x + 16.6, gameChar_y - 20, 8, 9);
		//arms
		strokeWeight(10);
		line(gameChar_x + 14, gameChar_y - 43, gameChar_x + 6, gameChar_y - 36);
		//feet
		strokeWeight(2);
		noStroke();
		ellipse(gameChar_x - 10, gameChar_y - 12, 16, 10);
		ellipse(gameChar_x + 6, gameChar_y - 7, 16, 10);
	}
	else if(isRight && isFalling)
	{
		//jumping-right code
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 73, 11, 11);
		strokeWeight(2);
		stroke(0);
		fill(255);
		rect(gameChar_x - 16, gameChar_y - 75, 32, 30, 13.5);
		fill(0);
		ellipse(gameChar_x - 11, gameChar_y - 73, 9, 9);
		//eyes
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 63, 5, 5);
		ellipse(gameChar_x + 7, gameChar_y - 63, 5, 5);
		ellipse(gameChar_x - 5, gameChar_y - 60, 6, 8);
		ellipse(gameChar_x + 9, gameChar_y - 60, 6, 8);
		ellipse(gameChar_x + 1, gameChar_y - 54, 2, 2);
		ellipse(gameChar_x + 3, gameChar_y - 54, 2, 2);
		noStroke();
		fill(255);
		ellipse(gameChar_x - 5.5, gameChar_y - 60.5, 4, 4);
		ellipse(gameChar_x + 6.5, gameChar_y - 60.5, 4, 4);
		//body
		stroke(0);
		rect(gameChar_x - 18, gameChar_y - 45, 35, 34, 15);
		fill(0);
		ellipse(gameChar_x - 16.6, gameChar_y - 20, 8, 9);
		//arms
		strokeWeight(10);
		line(gameChar_x - 6, gameChar_y - 36, gameChar_x - 14, gameChar_y - 43);
		//feet
		strokeWeight(2);
		noStroke();
		ellipse(gameChar_x - 6, gameChar_y - 7, 16, 10);
		ellipse(gameChar_x + 10, gameChar_y - 12, 16, 10);
	}
	else if(isLeft)
	{
		//walking left code
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 68, 11, 11);
		strokeWeight(2);
		stroke(0);
		fill(255);
		rect(gameChar_x - 16, gameChar_y - 70, 32, 30, 13.5);
		fill(0);
		ellipse(gameChar_x + 11, gameChar_y - 68, 9, 9);
		//eyes
		fill(0);
		ellipse(gameChar_x - 7, gameChar_y - 58, 5, 5);
		ellipse(gameChar_x + 3, gameChar_y - 58, 5, 5);
		ellipse(gameChar_x - 9, gameChar_y - 55, 6, 8);
		ellipse(gameChar_x + 5, gameChar_y - 55, 6, 8);
		ellipse(gameChar_x - 3, gameChar_y - 49, 2, 2);
		ellipse(gameChar_x - 1, gameChar_y - 49, 2, 2);
		noStroke();
		fill(255);
		ellipse(gameChar_x - 6.5, gameChar_y - 56, 4, 4);
		ellipse(gameChar_x + 5.5, gameChar_y - 55.5, 4, 4);
		//body
		stroke(0);
		rect(gameChar_x - 18, gameChar_y - 40, 35, 34, 15);
		fill(0);
		ellipse(gameChar_x + 16.6, gameChar_y - 15, 8, 9);
		//arms
		strokeWeight(10);
		line(gameChar_x + 7, gameChar_y - 36, gameChar_x + 2, gameChar_y - 26);
		//feet
		strokeWeight(2);
		noStroke();
		ellipse(gameChar_x - 10, gameChar_y - 4.5, 16, 10);
		ellipse(gameChar_x + 6, gameChar_y - 2, 16, 10);
	}
	else if(isRight)
	{
		//walking right code
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 68, 11, 11);
		strokeWeight(2);
		stroke(0);
		fill(255);
		rect(gameChar_x - 16, gameChar_y - 70, 32, 30, 13.5);
		fill(0);
		ellipse(gameChar_x - 11, gameChar_y - 68, 9, 9);
		//eyes
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 58, 5, 5);
		ellipse(gameChar_x + 7, gameChar_y - 58, 5, 5);
		ellipse(gameChar_x - 5, gameChar_y - 55, 6, 8);
		ellipse(gameChar_x + 9, gameChar_y - 55, 6, 8);
		ellipse(gameChar_x + 1, gameChar_y - 49, 2, 2);
		ellipse(gameChar_x + 3, gameChar_y - 49, 2, 2);
		noStroke();
		fill(255);
		ellipse(gameChar_x - 5.5, gameChar_y - 55.5, 4, 4);
		ellipse(gameChar_x + 6.5, gameChar_y - 55.5, 4, 4);
		//body
		stroke(0);
		rect(gameChar_x - 18, gameChar_y - 40, 35, 34, 15);
		fill(0);
		ellipse(gameChar_x - 16.6, gameChar_y - 15, 8, 9);
		//arms
		strokeWeight(10);
		line(gameChar_x - 10, gameChar_y - 36, gameChar_x - 2, gameChar_y - 26);
		//feet
		strokeWeight(2);
		noStroke();
		ellipse(gameChar_x - 6, gameChar_y - 2, 16, 10);
		ellipse(gameChar_x + 10, gameChar_y - 4.5, 16, 10);
	}
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards code
		strokeWeight(2);
		stroke(0);
		fill(255);
		rect(gameChar_x - 16, gameChar_y - 75, 32, 30, 13.5);
		fill(0);
		ellipse(gameChar_x - 13.5, gameChar_y - 73, 9, 9);
		ellipse(gameChar_x + 13.5, gameChar_y - 73, 9, 9);
		//eyes
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 63, 5, 5);
		ellipse(gameChar_x + 5, gameChar_y - 63, 5, 5);
		ellipse(gameChar_x - 7, gameChar_y - 60, 6, 8);
		ellipse(gameChar_x + 7, gameChar_y - 60, 6, 8);
		ellipse(gameChar_x - 1, gameChar_y - 54, 2, 2);
		ellipse(gameChar_x + 1, gameChar_y - 54, 2, 2);
		noStroke();
		fill(255);
		ellipse(gameChar_x - 6, gameChar_y - 60.5, 4, 4);
		ellipse(gameChar_x + 6, gameChar_y - 60.5, 4, 4);
		//body
		stroke(0);
		rect(gameChar_x - 18, gameChar_y - 45, 35, 34, 15);
		//arms
		strokeWeight(10);
		line(gameChar_x - 13, gameChar_y - 38, gameChar_x - 20, gameChar_y - 48);
		line(gameChar_x + 13, gameChar_y - 38, gameChar_x + 20, gameChar_y - 48);
		//feet
		strokeWeight(2);
		noStroke();
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 11, 15, 11);
		ellipse(gameChar_x + 10, gameChar_y - 11, 15, 11);
	}
	else
	{
		//standing front facing code
		strokeWeight(2);
		stroke(0);
		fill(255);
		rect(gameChar_x - 16, gameChar_y - 70, 32, 30, 13.5);
		fill(0);
		ellipse(gameChar_x - 13.5, gameChar_y - 68, 9, 9);
		ellipse(gameChar_x + 13.5, gameChar_y - 68, 9, 9);
		//eyes
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 58, 5, 5);
		ellipse(gameChar_x + 5, gameChar_y - 58, 5, 5);
		ellipse(gameChar_x - 7, gameChar_y - 55, 6, 8);
		ellipse(gameChar_x + 7, gameChar_y - 55, 6, 8);
		ellipse(gameChar_x - 1, gameChar_y - 49, 2, 2);
		ellipse(gameChar_x + 1, gameChar_y - 49, 2, 2);
		noStroke();
		fill(255);
		ellipse(gameChar_x - 6, gameChar_y - 55.5, 4, 4);
		ellipse(gameChar_x + 6, gameChar_y - 55.5, 4, 4);
		//body
		stroke(0);
		rect(gameChar_x - 18, gameChar_y - 40, 35, 34, 15);
		//arms
		strokeWeight(10);
		line(gameChar_x - 13, gameChar_y - 38, gameChar_x - 20, gameChar_y - 28);
		line(gameChar_x + 13, gameChar_y - 38, gameChar_x + 20, gameChar_y - 28);
		//feet
		strokeWeight(2);
		noStroke();
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 2, 15, 10);
		ellipse(gameChar_x + 10, gameChar_y - 2, 15, 10);
	}	
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(clouds)
{
	for(var i = 0; i < clouds.length; i++)
	{
		fill(clouds[i].colour);
		ellipse(clouds[i].x_pos - 95*clouds[i].size,
				clouds[i].y_pos + 15* clouds[i].size,
				65 * clouds[i].size, 
				45 * clouds[i].size);
		ellipse(clouds[i].x_pos, 
				clouds[i].y_pos, 
				70 * clouds[i].size, 
				45 * clouds[i].size);
		ellipse(clouds[i].x_pos - 50* clouds[i].size, 
				clouds[i].y_pos, 
				100 * clouds[i].size, 
				80 * clouds[i].size);
		ellipse(clouds[i].x_pos - 15* clouds[i].size, 
				clouds[i].y_pos - 25* clouds[i].size, 
				50 * clouds[i].size, 
				35 * clouds[i].size);
	}
}

// Function to draw mountains objects.
function drawMountains(mountains)
{
	for(var i = 0; i < mountains.length; i++)
	{
		fill(mountains[i].colour1);
		triangle(mountains[i].x_pos - 80 * mountains[i].size, mountains[i].y_pos, mountains[i].x_pos + 50 * mountains[i].size, mountains[i].y_pos - 288 * mountains[i].size, mountains[i].x_pos, mountains[i].y_pos);
		fill(mountains[i].colour2);
		triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos + 50 * mountains[i].size, mountains[i].y_pos - 288 * mountains[i].size, mountains[i].x_pos + 160 * mountains[i].size, mountains[i].y_pos);
		fill(252,252,207,100);
		triangle(mountains[i].x_pos + 20 * mountains[i].size, mountains[i].y_pos - 222 * mountains[i].size, mountains[i].x_pos + 50 * mountains[i].size, mountains[i].y_pos - 288 * mountains[i].size, mountains[i].x_pos + 76 * mountains[i].size, mountains[i].y_pos - 222 * mountains[i].size);
	}
}

// Function to draw trees objects.

function drawTrees()
{
	for (var i = 0; i< trees.length; i++)
	{	
		strokeWeight(trees[i].size);
		stroke(0, 102, 0);
		line(trees[i].x_pos, floorPos_y - 2, trees[i].x_pos, floorPos_y - trees[i].y_pos);
		strokeWeight(4);
		stroke(102, 102, 0);
		for (var j=0; j<7; j++)
		{
			line(trees[i].x_pos - (trees[i].size)/2,
				 floorPos_y - ((trees[i].y_pos)/7)*j - 5,
				 trees[i].x_pos + (trees[i].size)/2,
				 floorPos_y - ((trees[i].y_pos)/7)*j - 5);
		}
		noStroke();
		fill(0, 153, 76);
		for (var j=0; j<4; j++)
		{
			beginShape();
			vertex(trees[i].x_pos, floorPos_y - ((trees[i].y_pos)/3.3)*j - 5);
			vertex(trees[i].x_pos - 14, floorPos_y - ((trees[i].y_pos)/3.3)*j -7);
			vertex(trees[i].x_pos - 32, floorPos_y - ((trees[i].y_pos)/3.3)*j -25);
			vertex(trees[i].x_pos - 12, floorPos_y - ((trees[i].y_pos)/3.3)*j - 16);
			vertex(trees[i].x_pos, floorPos_y - ((trees[i].y_pos)/3.3)*j - 5);
			endShape();
			beginShape();
			vertex(trees[i].x_pos, floorPos_y - ((trees[i].y_pos)/4.2)*j - 15);
			vertex(trees[i].x_pos + 18, floorPos_y - ((trees[i].y_pos)/4.2)*j -16);
			vertex(trees[i].x_pos + 35, floorPos_y - ((trees[i].y_pos)/4.2)*j -27);
			vertex(trees[i].x_pos + 12, floorPos_y - ((trees[i].y_pos)/4.2)*j - 24);
			vertex(trees[i].x_pos, floorPos_y - ((trees[i].y_pos)/4.2)*j - 15);
			endShape();
		}
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	noStroke();
	fill(53, 17, 17);
	rect(t_canyon.x_pos,floorPos_y, t_canyon.width, height/6 + 5);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if (t_canyon.x_pos < gameChar_world_x && gameChar_world_x < (t_canyon.x_pos + t_canyon.width))
	{
		if(gameChar_y >= floorPos_y)
		{
			isPlummeting = true;
			if(lives > 1)
			{
				if (!fallSound.isPlaying()) 
				{
					fallSound.play();
					return;
				}
			}
			if(lives == 0)
			{
				if (!gameOverSoundisPlaying)
				{
					gameOverSound.play();
					myBackgroundSound.stop();
					gameOverSoundisPlaying = true;
					return;
				}
			}
		}
	}
	if (isPlummeting == true)
	{
		gameChar_y += 1.3;
		
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
	noFill();
	strokeWeight(4);
	stroke(255,255,0,240);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, 0.3 * t_collectable.size, 0.3 * t_collectable.size);
	line(t_collectable.x_pos + 9, t_collectable.y_pos, t_collectable.x_pos + 33, t_collectable.y_pos);
	rect(t_collectable.x_pos + 25, t_collectable.y_pos - 5, 0.1 * t_collectable.size, 0.04 * t_collectable.size);
	noStroke();

}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 25)
	{
		t_collectable.isFound = true;
		game_score += 1;
		dingSound.play();
	}
}

// Function to render flag
function renderFlagpole()
{
	push();
	strokeWeight(6);
	stroke(88, 65, 65);
	line(flagpole.x_pos, floorPos_y - 2, flagpole.x_pos, floorPos_y - 240);
	fill(153, 0, 0);
	strokeWeight(4);
	stroke(128, 0, 0);
	
	if(flagpole.isReached)
	{
		triangle(flagpole.x_pos, floorPos_y - 240, flagpole.x_pos, floorPos_y - 200, flagpole.x_pos + 40, floorPos_y - 220);
	}
	else
	{
		triangle(flagpole.x_pos, floorPos_y - 4, flagpole.x_pos, floorPos_y - 44, flagpole.x_pos + 40, floorPos_y - 24);
	}
	pop();
}

// Function to check if character has reached the flagpole
function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);
	if(d < 15)
	{
		flagpole.isReached = true;
		gameCompletedSound.play();
	}
}

// Function to check if character has fallen down the canyon and lost a life
function checkPlayerDie()
{
	if(gameChar_y > 576)
	{
		lives -= 1;
		if(lives > 0)
		{
			myBackgroundSound.stop();
			startGame();
		}
		if(lives == 0)
		{
			gameOver = true;
		}
	}
}

function setGradient(x, y, w, h, c1, c2) 
{
	noFill();
    for (var i = y; i <= y+h; i++) 
	{
		var inter = map(i, y, y+h, 0, 1);
		var c = lerpColor(c1, c2, inter);
		stroke(c);
		line(x, i, x+w, i);
    }
}

function sunGradient(x, y, w, h, c1, c2) 
{
	noStroke();
    for (var i = Math.max(w,h); i>0; i--) 
	{
		s = i / Math.max(w, h);
		colour = lerpColor(c1, c2, s);
		fill(colour);
		ellipse(x, y, s * w, s * h);
	}
}

function createPlatforms(x, y, length)
{
	var p = {x: x,
			y: y,
			length: length,
			draw: function()
				{
					fill(51, 51, 0);
					rect(this.x, this.y, this.length, 15);
				},
			 checkContact: function(gc_x, gc_y)
			 {
				 var d = this.y - gc_y;
				 if(gc_x > this.x && gc_x < this.x + this.length)
				 {
					 if (d <= 0 && d < 5)
					 {
						return true;
					 }
				 }
				 else
					 return false;
			}
			};
	return p;
}

function loaded()
{
	myBackgroundSound.loop();
	myBackgroundSound.setVolume(0.1);
}

function loaded2()
{
	gameCompletedSound.play();
	gameCompletedSound.setVolume(0.2);
}