var StateMain={    
    
   preload:function(){
       
       if (screen.width < 1500) {
            game.scale.forceOrientation(true, false);
        }
       game.load.spritesheet("dragon", "images/main/dragon.png", 120, 85, 4);
       game.load.image("background", "images/main/background.png");
       game.load.spritesheet("candy", "images/main/candy.png", 52, 50, 8);
       game.load.image("balloon", "images/main/thought.png");

       
    },
       
    //CREATE *****************************************///////////////////////////////////////////
    create:function(){
        //intiate variables
        score = 0;
        
        game.physics.startSystem(Phaser.Physics.Arcade);
        
        
        
        this.top = 0; // top is declared because mobil devices vary in sizes
        //define a bottom for gravity
        this.bottom = game.height - 122;
        
        
        
        // backgroung
        this.background = game.add.tileSprite(0, game.height - 480, game.width, 480, "background");
        
        //IPAD Fix
        
        if (screen.height > 764){
            this.background.y = game.world.centerY - this.background.height / 2;
            // reposition the left corner of the background
            this.top = this.background.y;
        }
                
        // dragon
        this.dragon = game.add.sprite(0,0, "dragon");
        this.dragon.animations.add("fly", [0,1,2,3], 12, true);
        this.dragon.animations.play("fly");
        

//        this.dragon.bringToTop(); // brings the dragon to the top if background is build after declaring the dragon
        this.dragon.y = this.top;    
        this.background.autoScroll(-100, 0);
        
        //candies
        this.candies = game.add.group();
        this.candies.createMultiple(40, "candy");
        this.candies.setAll("checkWorldBounds", true);
        this.candies.setAll("outOfBoundsKill", true);
        
        
        //thought
        this.balloonGroup = game.add.group();
        this.balloon = game.add.sprite(0, 0, "balloon");
        this.think = game.add.sprite(36, 26, "candy");
        this.balloonGroup.add(this.balloon);
        this.balloonGroup.add(this.think);
        this.balloonGroup.scale.x = .5;
        this.balloonGroup.scale.y = .5;
        this.balloonGroup.x = 50;
        
        //text
        this.scoreText = game.add.text(game.world.centerX, 60, "0");
        this.scoreText.fill = "#000000";
        this.scoreText.fontSize = 64;
        this.scoreText.anchor.set(0.5, 0.5);
        
        
        this.scorelabel = game.add.text(game.world.centerX, 20, "SCORE");
        this.scorelabel.fill = "#000000";
        this.scorelabel.fontSize = 32;
        this.scorelabel.anchor.set(0.5, 0.5);
        
        
        game.physics.enable([this.dragon, this.candies], Phaser.Physics.ARCADE);
        this.dragon.body.immovable = true;
        
        this.dragon.body.gravity.y = 500;
        

        
        this.setListeners();
        this.resetThink();
    },
    
     setListeners: function () {
        if (screen.width < 1500) {
        game.scale.enterIncorrectOrientation.add(this.wrongWay, this);
        game.scale.leaveIncorrectOrientation.add(this.rightWay, this);
        }
    // timer needed for the candy
        game.time.events.loop(Phaser.Timer.SECOND, this.fireCandy, this);
    },

    
    fireCandy: function(){
        var candy = this.candies.getFirstDead();
        var yy = game.rnd.integerInRange(0, game.height- 60);
        var xx = game.width - 100;
        var type = game.rnd.integerInRange(0, 7);
        
        candy.frame = type; 
        candy.reset(xx, yy);
        candy.enabled = true;
        candy.body.velocity.x = -200;
    },
    // Checking for mobile device orientation ************************************
    
     wrongWay: function () {

        document.getElementById("wrongWay").style.display = "block";

    },
        
     rightWay: function () {
        document.getElementById("wrongWay").style.display = "none";
    },
    
    
    
    // how fast dragon flies up ******************************************************
    
    
    flap: function(){
        this.dragon.body.velocity.y = -350;
    },
      
    
    onEat: function(dragon, candy){
        if(this.think.frame == candy.frame){
            candy.kill();
            this.resetThink();
            score++;
            this.scoreText.text = score;
        }
        else{
            candy.kill();
            game.state.start("StateOver");
        }
        
    },
    
    resetThink: function(){ // randomize the candy in dragon's thoughts.
        var thinking = game.rnd.integerInRange(0,7);
        this.think.frame = thinking;
    },
    
    
    // UPDATE *******************************///////////////////////////////////////////
    
    update: function(){
        game.physics.arcade.collide(this.dragon, this.candies,null, this.onEat, this);
    
        this.balloonGroup.y=this.dragon.y -60;
        
        if(game.input.activePointer.isDown){
            this.flap();
        }
        
        // constanly check the top
        
        if (this.dragon.y < this.top){
            this.dragon.y = this.top;
            this.dragon.body.velocity.y = 0;
        }
        //constantly check for dragon posiitn onthe y axis.
        if (this.dragon.y > this.bottom){
            this.dragon.y = this.bottom;
            this.dragon.body.gravity.y = 0;
        }
        else {
            this.dragon.body.gravity.y = 500;
        }
    }
    
}