/*

The Game Project  

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlumeting;

var game_score;
var flagpole;
var lives;
var platforms;


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    lives = 4;
        
    startGame();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlumeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [200,500,900,1400,1600,1900];
    
    clouds = [{x_pos: 20, y_pos: 100, size: 100},
              {x_pos: 700, y_pos: 100, size: 100}, 
              {x_pos: 1200, y_pos: 100, size: 100} ];
    
    mountains = [{x_pos: 0, y_pos: 100},
                 {x_pos: 1000, y_pos: 100}];
    
    canyons = [{x_pos: 50, width: 100},
               {x_pos: 1040, width: 100},
               {x_pos: 2040, width: 100}];
    
    collectables = [{x_pos: 300, y_pos: 395, size: 50},
                    {x_pos: 1200, y_pos: 395, size: 50},
                    {x_pos: 900, y_pos: 295, size: 50},
                    {x_pos: 1700, y_pos: 295, size: 50}];
    
    game_score = 0;
    
    flagpole = {x_pos:2540, isReached:false};
    
    lives -= 1;
    
    platforms = [];
    
    platforms.push(createPlatform(800, floorPos_y - 100, 100));
    platforms.push(createPlatform(1600, floorPos_y - 100 ,100));
}

function draw()
{
	background(143, 212, 255); //sky 

	noStroke();
	fill(100, 158, 189);
	rect(0, floorPos_y, width, height/4);
    fill(75, 171, 73);
    rect(0,460,1024,144); //green ground

    push();
    translate(scrollPos,0);
	
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
	// Draw canyons.
    for(i=0; i<canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
	// Draw collectable items.
    for(i=0; i<collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
         drawCollectable(collectables[i]);
         checkCollectable(collectables[i]);
        }
    }
    
    //draw flagpole
    renderFlagpole();
    
    //draw platforms
    for(i=0; i<platforms.length; i++)
    {
        platforms[i].draw();
    }

    pop();

	// Draw game character.
	drawGameChar();
    
    //draw screen text
    fill(209, 85, 250);
    textSize(30);
    text("Score : " + game_score, 20,30);
    
    //draw lives
    for(i=0; i< lives; i++)
    {
        fill(87, 76, 65);
        ellipse(170+i*29,22,20,20);
        fill(0);
        ellipse(167+i*29,22,2,2);
		fill(0);
        ellipse(160+i*29,22,2,2);
        fill(231, 163, 240);
        ellipse(180+i*30,15,10,10);
 
    }
    
    //Logic for gameover and complete
    if(lives < 1)
    {
        fill(245, 66, 215);
        text("Game Over - press space to continue", width/2 - 200, height/2);
        return;
    }
    else if(flagpole.isReached == true)
    {
        fill(random(0,255),random(0,255),random(0,255));
        textSize(40);
        text("YOU WON!",width/2 + 100,height - 220);
        fill(0);
        textSize(30);
        text("Level complete! Press space to continue", width/2 - 100, height/3);
        return;    
    }
        
    //Logic to move the character rise and fall
     if(gameChar_y < floorPos_y)
    {
        var isContact = false;

        for(var i=0; i<platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {
            gameChar_y = gameChar_y + 5;
            isFalling = true;
        }
        else 
        {
            isFalling -= false;
        }
    }
    else
    {
        isFalling = false;
    }

    //falling canyon
    if(isPlumeting == true)
    {
        gameChar_y += 7;
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

    //logic for flagpole
    if(flagpole.isReached != true)
    {
        checkFlagpole();
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

    //conditional statement for player falls into canyon
    if(gameChar_y > height && lives > 0)
    {
            startGame();       
    }
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }

     if(keyCode == 37)
    {
        isLeft = true;
    }
    if(keyCode == 39)
    {
        isRight = true;
    }
    if(keyCode == 32 && gameChar_y == floorPos_y)
    {
        isFalling = true; 
        gameChar_y -= 200;
    }
}

function keyReleased()
{
    if(keyCode == 37)
    {
        isLeft = false;
    }
    if(keyCode == 39)
    {
        isRight = false;
    }
    if(keyCode == 32)
    {
        isFalling = false;
    }  
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{    
    if(isLeft && isFalling)
	{
        //jumping-left code
  //bodyshape
		fill(87, 75, 61);
        rect(gameChar_x - 20,gameChar_y - 35,35,35,15,15,5,5);

        //nose
		stroke("black");
         strokeWeight(7);
        point(gameChar_x-15, gameChar_y - 15);

        //eyes
		stroke("black");
        strokeWeight(3);
        point(gameChar_x - 4, gameChar_y - 25);
       

        //ears
		strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        ellipse(gameChar_x + 20,gameChar_y - 33,20,20);
        
		
	     //tail
	    strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        rect(gameChar_x+10,gameChar_y - 20,15,8);

	}
	else if(isRight && isFalling)
	{
        //jumping-right code
        //bodyshape
		fill(87, 75, 61);
        rect(gameChar_x - 20,gameChar_y - 35,35,35,15,15,5,5);

        //nose
		stroke("black");
         strokeWeight(7);
        point(gameChar_x+15, gameChar_y - 15);

        //eyes
		stroke("black");
        strokeWeight(3);
        point(gameChar_x + 4, gameChar_y - 25);
       

        //ears
		strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        ellipse(gameChar_x - 20,gameChar_y - 35,20,20);
        
		
	     //tail
	    strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        rect(gameChar_x-25,gameChar_y - 20,15,8);
	}
	else if(isLeft)
	{
         //walking left code  
             //bodyshape
		fill(87, 75, 61);
        rect(gameChar_x - 20,gameChar_y - 35,35,35,15,15,5,5);

        //nose
		stroke("black");
         strokeWeight(7);
        point(gameChar_x-15, gameChar_y - 15);

        //eyes
		stroke("black");
        strokeWeight(3);
        point(gameChar_x - 4, gameChar_y - 25);
       

        //ears
		strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        ellipse(gameChar_x + 20,gameChar_y - 33,20,20);
        
		
	     //tail
	    strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        rect(gameChar_x+7,gameChar_y - 5,20,5);

	}
	else if(isRight)
	{
         //walking right code
     //bodyshape
		fill(87, 75, 61);
        rect(gameChar_x - 20,gameChar_y - 35,35,35,15,15,5,5);

        //nose
		stroke("black");
         strokeWeight(7);
        point(gameChar_x+15, gameChar_y - 15);

        //eyes
		stroke("black");
        strokeWeight(3);
        point(gameChar_x + 4, gameChar_y - 25);
       

        //ears
		strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        ellipse(gameChar_x - 20,gameChar_y - 35,20,20);
        
		
	     //tail
	    strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        rect(gameChar_x-25,gameChar_y - 5,20,5);
        
	}
	else if(isFalling || isPlumeting)
	{
         //jumping facing forwards code
       
        //bodyshape
		fill(87, 75, 61);
        rect(gameChar_x - 20,gameChar_y - 40,40,40,30,30,5,5);

        //nose
		stroke("black");
         strokeWeight(7);
        point(gameChar_x, gameChar_y - 15);

        //eyes
		stroke("black");
        strokeWeight(3);
        point(gameChar_x - 5, gameChar_y - 25);
        point(gameChar_x + 5, gameChar_y - 25);
      
		

        //ears
		strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        ellipse(gameChar_x - 20,gameChar_y - 35,20,20);
        ellipse(gameChar_x + 20,gameChar_y - 35,20,20);
		
	     //tail
	    strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        rect(gameChar_x-4,gameChar_y - 3,5,15);
        
	}
	else
	{
        // add your standing front facing code
       
      
        //bodyshape
		fill(87, 75, 61);
        rect(gameChar_x - 20,gameChar_y - 40,40,40,30,30,5,5);

        //nose
		stroke("black");
         strokeWeight(7);
        point(gameChar_x, gameChar_y - 15);

        //eyes
		stroke("black");
        strokeWeight(3);
        point(gameChar_x - 5, gameChar_y - 25);
        point(gameChar_x + 5, gameChar_y - 25);
      
		

        //ears
		strokeWeight(1);
        fill(227, 188, 235);
        stroke(0);
        ellipse(gameChar_x - 20,gameChar_y - 35,20,20);
        ellipse(gameChar_x + 20,gameChar_y - 35,20,20);
	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(i=0; i<clouds.length; i++)
     {
        fill(247, 247, 247);
        ellipse(clouds[i].x_pos +45, clouds[i].y_pos +65, clouds[i].size +25, clouds[i].size -40);
        ellipse(clouds[i].x_pos +60, clouds[i].y_pos +65, clouds[i].size +10, clouds[i].size -55);
		 ellipse(clouds[i].x_pos +70, clouds[i].y_pos +55, clouds[i].size +2, clouds[i].size -30);
        ellipse(clouds[i].x_pos +30, clouds[i].y_pos +55, clouds[i].size-30, clouds[i].size-30);
		 ellipse(clouds[i].x_pos +50, clouds[i].y_pos +75, clouds[i].size-20, clouds[i].size-30);

        ellipse(clouds[i].x_pos +300, clouds[i].y_pos, clouds[i].size+25, clouds[i].size -40);
        ellipse(clouds[i].x_pos +250, clouds[i].y_pos, clouds[i].size+10, clouds[i].size -55);
        ellipse(clouds[i].x_pos +275, clouds[i].y_pos -5, clouds[i].size -50, clouds[i].size -50);
        ellipse(clouds[i].x_pos +275, clouds[i].y_pos -10, clouds[i].size -30, clouds[i].size -30);
     }
}

// Function to draw mountains objects.
function drawMountains()
{
     for(i=0; i<mountains.length; i++)
     {
        fill(212, 212, 212);
        triangle(mountains[i].x_pos +420,
                 mountains[i].y_pos,
                 mountains[i].x_pos +300,
                 mountains[i].y_pos +332,
                 mountains[i].x_pos +760,
                 mountains[i].y_pos +332);

        fill(192,192,192);
        triangle(mountains[i].x_pos +800,
            mountains[i].y_pos,
            mountains[i].x_pos+500,
            mountains[i].y_pos+332,
            mountains[i].x_pos+960,
            mountains[i].y_pos+332);
		 
		 fill(145, 145, 145);
        triangle(mountains[i].x_pos +600,
                 mountains[i].y_pos,
                 mountains[i].x_pos +300,
                 mountains[i].y_pos +332,
                 mountains[i].x_pos +760,
                 mountains[i].y_pos +332);

		

    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(i=0; i<trees_x.length; i++)
    {
        noStroke();
        fill(242, 180, 36);
        ellipse(trees_x[i], floorPos_y-80, 60, 70);
        ellipse(trees_x[i] - 10, floorPos_y-60, 80, 60);
        ellipse(trees_x[i] + 10, floorPos_y-60, 80, 60);
        fill(187, 222, 31);
        ellipse(trees_x[i] + 80, floorPos_y-80, 60, 90);
        ellipse(trees_x[i] + 70, floorPos_y-60, 80, 60);
        ellipse(trees_x[i] + 90, floorPos_y-60, 80, 60);

        stroke(102,51,0);
        strokeWeight(8);
        line(trees_x[i], floorPos_y,trees_x[i], floorPos_y-36);
        line(trees_x[i] + 80, floorPos_y-36, trees_x[i] + 80, floorPos_y);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    noStroke();    
    fill(216, 222, 95);
    rect(t_canyon.x_pos, 432, t_canyon.width + 40, 150);
    fill(48, 43, 36);
    rect(t_canyon.x_pos, 432, t_canyon.width - 70, 150);
    rect(t_canyon.x_pos + 110, 432, t_canyon.width - 70, 150);
    fill(195, 107, 214);
    rect(t_canyon.x_pos - 2, t_canyon.width + 332, 33, 20);
    rect(t_canyon.x_pos + 110, t_canyon.width + 332, 30, 20);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos + 30 && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
    {
       isPlumeting = true;   
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    r = random();  
    fill(240, 234, 77);
    stroke(255,155,0);
    strokeWeight(3);
    ellipse(t_collectable.x_pos,
            t_collectable.y_pos , 
            t_collectable.size -5,
            t_collectable.size -5);

    strokeWeight(2);

    textSize(t_collectable.size -23);
    fill(255,155,0);
    text("C", t_collectable.x_pos -10, t_collectable.y_pos +9);
    textSize(12);

    noStroke();
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size )
    {
        t_collectable.isFound = true;
        game_score += 1;
    }
}

function renderFlagpole()
{
    push();
    stroke(158);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
  
    if(flagpole.isReached)
    {
        noStroke();
        fill(240, 234, 77);
        rect(flagpole.x_pos, floorPos_y - 200, 70, 50);

        fill(240, 234, 77);
        stroke(0);
        strokeWeight(0.5);
//        
    }
  else
      {
          noStroke();
          fill(230, 101, 252);
          rect(flagpole.x_pos,floorPos_y-50,70,50);
          strokeWeight(1);
          stroke(0);
          fill(255);

      }
  pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d<50)
    {
        flagpole.isReached = true;
    }
}

function createPlatform(x,y,length)
{
    var p = 
    {
     x: x,
     y: y,
     length: length, 
     draw: function()
     {
        fill(193, 98, 222);
        rect(this.x, this.y, this.length,10);
        fill(127, 222, 98);
        rect(this.x, this.y, this.length,5);
     },

     checkContact: function(gc_x, gc_y)
     {
         if(gc_x > this.x && gc_x < this.x + this.length)
         {
             var d = this.y - gc_y;
             if(d >= 0 && d < 5)
            {
                return true;
            }
         }
         return false;
     }
    }
 return p; 

}


//Thank you for reviewing my work!

