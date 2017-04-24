Pushbox.Level2 = function(game){

	this.bmd = null;
  // points arrays - one for x and one for y
  this.points = {
    'x': [360,480,480,480,480,360,360,360,480,480,600,720,720,720,720,720,600],
    'y': [120,120,240,360,480,480,360,240,240,120,120,120,240,360,240,120,120]
  };

};


Pushbox.Level2.prototype = {

	create: function(game){

	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(60, 60, game.world.width+120, game.world.height, 'background');

    //the map
	map = game.add.tilemap('map2', 60, 60);
    map.addTilesetImage('tileset');
    layer = map.createLayer(0, game.world.width, game.world.height);
    layer = map.createLayer(0);
    layer.resizeWorld();
    map.setCollisionBetween(0,3);

     //spots or lalagyan ng box
    this.spot = this.add.physicsGroup();
    spot1 = new SpotPlatform(this.game,game.world.width-90, game.world.height-480, 'spots', this.spot);
     //box
    box1 = new BoxPlatform(this.game, game.world.width-450, game.world.height-480, 'box');
    game.add.existing(box1);

    //key
    this.key = this.add.physicsGroup();
    key1 = new KeyPlatform(this.game,game.world.width-120, game.world.height -120, 'redkey', this.key);

    //lock
    lock = game.add.sprite(game.world.width-118,game.world.height-537,'lock1');
    lock.enableBody = true;
    game.physics.arcade.enable(lock);
    lock.body.setSize (56,56,0,0);
    lock.body.immovable = true;

    //setup our player
    player = game.add.sprite(game.world.width-920, game.world.height - 350, 'boy'); //create and position player
    game.physics.arcade.enable(player);
    player.body.allowGravity = false;
    player.body.isCircle = false;  // collision circle 
    player.body.setSize (53,55,2,0);
    player.body.fixedRotation=true; // do not rotate on collision
    game.camera.follow(player);

   
    // add some animations

    player.animations.add('up', [5, 6, 7, 8], 22,true);
    player.animations.add('down', [1, 2, 3, 4], 22,true);
    player.animations.add('left', [15, 16, 17, 18, 19, 20], 22,true);
    player.animations.add('right', [9, 10, 11, 12, 13 ,14], 22,true); 
    
      //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 1000, 10, 'Life : ', { font: '34px Arial', fill: '#fff' });

     //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var heart = lives.create(game.world.width - 870 + (40 * i), 30, 'heart');
        heart.anchor.setTo(0.5, 0.5);
    }


        // create our virtual game controller buttons 
         
    buttonup = game.add.button(game.world.width-920, game.world.height-420, 'buttonup', null, this, 1, 0, 1, 0);
    buttonup.fixedToCamera = true;
    buttonup.alpha = 0.5;
    buttonup.events.onInputOver.add(function(){up=true;});
    buttonup.events.onInputOut.add(function(){up=false;});
    buttonup.events.onInputDown.add(function(){up=true;});
    buttonup.events.onInputUp.add(function(){up=false;});

   
    buttondown = game.add.button(game.world.width-920, game.world.height-220, 'buttondown', null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.alpha = 0.5;
    buttondown.events.onInputOver.add(function(){down=true;});
    buttondown.events.onInputOut.add(function(){down=false;});
    buttondown.events.onInputDown.add(function(){down=true;});
    buttondown.events.onInputUp.add(function(){down=false;});



    buttonright = game.add.button(game.world.width-820, game.world.height-320, 'buttonright', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.alpha = 0.5;
    buttonright.events.onInputOver.add(function(){right=true;});
    buttonright.events.onInputOut.add(function(){right=false;});
    buttonright.events.onInputDown.add(function(){right=true;});
    buttonright.events.onInputUp.add(function(){right=false;});



    buttonleft = game.add.button(game.world.width-1019, game.world.height-320, 'buttonleft', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.alpha = 0.5;
    buttonleft.events.onInputOver.add(function(){left=true;});
    buttonleft.events.onInputOut.add(function(){left=false;});
    buttonleft.events.onInputDown.add(function(){left=true;});
    buttonleft.events.onInputUp.add(function(){left=false;});

    //enemy ai creation 

    this.increment = 0.8 / game.width;  
    this.i = 0;
    this.timer1Stopped = true;
    this.timer1 = null;

    // Somewhere to draw to
    this.bmd = this.add.bitmapData(this.game.width, this.game.height);
    this.bmd.addToWorld();
    // Draw the path
    for (var j = 0; j < 1; j += this.increment) {
      var posx = this.math.linearInterpolation(this.points.x, j);
      var posy = this.math.linearInterpolation(this.points.y, j);
      //this.bmd.rect(posx, posy, 3, 3, 'rgba(245, 0, 0, 1)');
    }

    // create the monster sprite - we will make this sprite  
    // follow the motion path by using the plot function 
    enemy = game.add.sprite(0, game.world.height - 0, 'monster')
    game.physics.arcade.enable(enemy);
    enemy.body.allowGravity = false;
    enemy.body.isCircle = false;  // collision circle 
    enemy.animations.add('move',[0,1,2],3, true);

    undo = game.add.button(game.world.width-340,game.world.height-700,'undo',this.undo,this);
    undo.alpha = 0.6;
    restart = game.add.button(game.world.width-230,game.world.height-700,'restart',this.restart,this);
    restart.alpha = 0.6;
    pause = game.add.button(game.world.width-120,game.world.height-700,'pause',this.pause,this);
    pause.alpha = 0.6;

    home = game.add.button(game.world.width-435,game.world.height-700,'home',this.home,this);
    home.alpha = 0.6;

    this._fontStyle = { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "center" };
	cursors = game.input.keyboard.createCursorKeys();
    },

     home: function(){

        this.state.start('MainMenu');
    },

	checkOverlap: function(spriteA,spriteB){

    var boundA = spriteA.getBounds();
    var boundB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundA,boundB);
  },

	update: function(game){

		game.physics.arcade.collide(player,layer);
		game.physics.arcade.collide(player,box1);
    	game.physics.arcade.collide(box1,layer);
    	game.physics.arcade.collide(player,key1,this.unlock);
     	game.physics.arcade.collide(player,lock);
     	game.physics.arcade.collide(box1,lock);
     
    	
		if (this.timer1Stopped) {
      	this.timer1Stopped = false;
      	this.timer1 = this.game.time.create(true);
      	this.timer1.loop(.01, this.plot, this);
      	this.timer1.start();
    }  
    	if(game.physics.arcade.overlap(box1,this.spot)){
        spot1.kill();
        if(level == 1){

            level = level+1;
        }
    	this.add.image(0,0,'background3',this);
        this.add.button(380,400,'restart',this.restart,this);
        this.add.button(480,400,'continue',this.startGame,this);
        this.add.button(580,400,'home',this.menu,this);
    	}

    	if (this.checkOverlap(player,enemy)){

        this.lifeHandler();
    } 

    if (this.checkOverlap(box1,enemy)){

        enemy.alpha = 0.9;
    }
    else{

        enemy.alpha = 1;
    }   
 	
    if (left)
    {
        player.body.velocity.x =-playerSpeed;
        player.animations.play('left',10);
    }
    else if (right)
    {
        player.body.velocity.x = playerSpeed;
        player.animations.play('right',10);
    }

    else if (up)
    {
        player.body.velocity.y = -playerSpeed;
        player.animations.play('up',10);
    }
    else if (down) {

        player.body.velocity.y = playerSpeed;
        player.animations.play('down',10);
    }
    else{   
       player.body.velocity.x = 0;
       player.body.velocity.y = 0;
       player.loadTexture('boy', 0);
    }

 // if (cursors.left.isDown)
 //    {
 //        player.body.velocity.x =-playerSpeed;
 //        player.animations.play('left',10);
 //    }
 //    else if (cursors.right.isDown)
 //    {
 //        player.body.velocity.x = playerSpeed;
 //        player.animations.play('right',10);
 //    }

 //    else if (cursors.up.isDown)
 //    {
 //        player.body.velocity.y = -playerSpeed;
 //        player.animations.play('up',10);
 //    }
 //    else if (cursors.down.isDown) {

 //        player.body.velocity.y = playerSpeed;
 //        player.animations.play('down',10);
 //    }
 //    else{   
 //       player.body.velocity.x = 0;
 //       player.body.velocity.y = 0;
 //       player.loadTexture('boy', 0);
 //    }
   
	},

		 plot: function() {
    
    var posx = this.math.linearInterpolation(this.points.x, this.i);
    var posy = this.math.linearInterpolation(this.points.y, this.i);
    enemy.x = posx;
    enemy.y = posy;
    this.i += this.increment;
    if (posx <360) {
      this.timer1.stop();
      this.timer1.destroy();
      this.i = 0;
      this.timer1Stopped = true;
    }

    if (posx===360){

        enemy.animations.play('move',5);
    }
  },

  undo: function(){
    undo.kill();
    box1.reset(570,240);

  },

  lifeHandler: function(){

	live = lives.getFirstAlive();

    if (live)
    {
    	live.kill();
    	player.reset(100,370);
    
    }
    
     if (lives.countLiving() < 1)
    {
        player.kill();
        this.add.image(0,0,'background2',this);
        this.add.button(430,400,'restart',this.restart,this);
        this.add.button(530,400,'home',this.menu,this);
       
    }

  },

  	startGame: function(){

  		this.state.start('Level21');
  	},

    restart: function(){

        this.state.restart();
    },

    pause: function(){

        this.game.paused = true;
        // add proper informational text
        var pausedText = this.add.text(270, 250, "Game paused.\nTap anywhere to continue.", this._fontStyle);
        // set event listener for the user's click/tap the screen
        this.input.onDown.add(function(){
            // remove the pause text
            pausedText.destroy();
            // unpause the game
            this.game.paused = false;
        }, this);
    },

    menu: function(){

        this.state.start('MainMenu');
    },

  unlock: function(){

  	key1.kill();
  	lock.kill();

  }
};

     BoxPlatform = function (game, x, y) {

        Phaser.Sprite.call(this,game,x,y,"box");
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.enableBody = true;
        this.anchor.x = 0.5;
        this.body.setSize(55,55,0,0,null);
        this.body.isCircle = false;
        this.collideWorldBounds = true;
        this.body.allowGravity = false;
        this.body.fixedRotation = true;
 };

 BoxPlatform.prototype = Object.create(Phaser.Sprite.prototype);
 BoxPlatform.prototype.constructor = BoxPlatform;

 BoxPlatform.prototype.update = function() {
        
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
};

    SpotPlatform = function (game, x, y, key, group) {

        Phaser.Sprite.call(this, game, x, y,'spots');
        game.physics.arcade.enable(this);
        this.anchor.x = 0.5;
        this.body.setSize(55,55,0,0,null);
        this.body.allowGravity = false;
        this.body.immovable = true;
        group.add(this);

    };

SpotPlatform.prototype = Object.create(Phaser.Sprite.prototype);
SpotPlatform.prototype.constructor = SpotPlatform;

    KeyPlatform = function (game, x, y, key, group) {

        Phaser.Sprite.call(this, game, x, y, key);
        game.physics.arcade.enable(this);
        this.anchor.x = 0.5;
        this.body.allowGravity = false;
        this.body.immovable = true;
        group.add(this);

    };

KeyPlatform.prototype = Object.create(Phaser.Sprite.prototype);
KeyPlatform.prototype.constructor = KeyPlatform;
