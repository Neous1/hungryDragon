var StateMain={    
    
   preload:function(){
       
       if (screen.width < 1500) {
            game.scale.forceOrientation(true, false);
        }
       game.load.spritesheet("dragon", "images/main/dragon.png", 120, 85, 4);
       game.load.image("background", "images/main/background.png");
       game.load.spritesheet("candy", "images/main/candy.png", 52, 50, 8);
       
       game.load.image("balloon", "images/main/thought.png");
       game.load.spritesheet("soundButtons", "images/ui/soundButtons.png", 44, 44, 4);
       
       game.load.audio("burp", "sounds/burp.mp3");
       game.load.audio("gulp", "sounds/gulp.mp3");
       game.load.audio("backgroundMusic", "sounds/background.mp3");
       
    },
       
    //CREATE *****************************************///////////////////////////////////////////
    create:function(){
        //intiate variables
        score = 0;
        this.musicPlaying = false;
        this.lift = 550;
        this.fall = 1500;
        this.delay = 1
        
        game.physics.startSystem(Phaser.Physics.Arcade);
        
        game.stage.backgroundColor = "#000000"
                
        this.top = 0; // top is declared because mobil devices vary in sizes
        //define a bottom for gravity
        this.bottom = game.height - 122;
        
        //sounds
        this.burp = game.add.audio("burp");
        this.gulp = game.add.audio("gulp");
        this.backgroundMusic = game.add.audio("backgroundMusic");
        this.backgroundMusic.volume = .5;
        this.backgroundMusic.loop = true;
        
        // backgroung
        this.background = game.add.tileSprite(0, game.height - 480, game.width, 480, "background");
        
        //IPAD Fix
        
        if (screen.height > 764){
            this.background.y = game.world.centerY - this.background.height / 2;
            // reposition the left corner of the background
            this.top = this.background.y;
            this.bottom = this.background.y + this.background.height -122
        }
                
        // dragon
        this.dragon = game.add.sprite(0,0, "dragon");
        this.dragon.animations.add("fly", [0,1,2,3], 12, true);
        this.dragon.animations.play("fly");
        

        // brings the dragon to the top if background is build after declaring the dragon
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
        this.scoreText = game.add.text(game.world.centerX, this.top + 60, "0");
        this.scoreText.fill = "#000000";
        this.scoreText.fontSize = 64;
        this.scoreText.anchor.set(0.5, 0.5);
        
        // Score
        this.scorelabel = game.add.text(game.world.centerX, this.top + 20, "SCORE");
        this.scorelabel.fill = "#000000";
        this.scorelabel.fontSize = 32;
        this.scorelabel.anchor.set(0.5, 0.5);
        
        
        // sound Buttons
        this.btnMusic = game.add.sprite(20, this.top + 20, "soundButtons");
        this.btnSound = game.add.sprite(70, this.top + 20, "soundButtons");
        this.btnMusic.frame = 2;
        
        game.physics.enable([this.dragon, this.candies], Phaser.Physics.ARCADE);
        this.dragon.body.immovable = true;
        
        this.dragon.body.gravity.y = this.fall;
            
        this.setListeners();
        this.resetThink();
        this.updateButtons();
        this.updateMusic();
    },
    //Listerners ********************//Listerners ********************//Listerners ***************
     setListeners: function () {
        if (screen.width < 1500) {
        game.scale.enterIncorrectOrientation.add(this.wrongWay, this);
        game.scale.leaveIncorrectOrientation.add(this.rightWay, this);
        }
    // timer needed for the candy
        game.time.events.loop(Phaser.Timer.SECOND *this.delay, this.fireCandy, this);
         
         this.btnSound.inputEnabled = true;
         this.btnSound.events.onInputDown.add(this.toggleSound, this);
         
         this.btnMusic.inputEnabled = true;
         this.btnMusic.events.onInputDown.add(this.toggleMusic, this);
    },

    // FuNctions *****************// FuNctions *****************// FuNctions ****************
    
    // Sounds toggle on / off
    toggleSound: function(){
        soundOn = !soundOn;
        this.updateButtons();
    },
    
    toggleMusic: function(){
      musicOn = !musicOn
        this.updateButtons();
        this.updateMusic();
    },
    
    updateMusic: function(){
        if(musicOn == true){
            if(this.musicPlaying == false){
                this.musicPlaying = true;
                this.backgroundMusic.play();    
            }
            
        }
        else{
            this.musicPlaying = false;
            this.backgroundMusic.stop();
        }
    },
    
    updateButtons: function(){
        if (soundOn == true){
            this.btnSound.frame = 0;
            
        }
        else {
            this.btnSound.frame = 1;
        }
        
        if (musicOn == true){
            this.btnMusic.frame = 2;
            
        }
        else{
            this.btnMusic.frame = 3;
        }
    },
    
    fireCandy: function(){
        var candy = this.candies.getFirstDead();
        var yy = game.rnd.integerInRange(this.top, this.bottom);
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
        this.dragon.body.velocity.y = -this.lift;
    },
      
    
    onEat: function(dragon, candy){
        if(this.think.frame == candy.frame){
            candy.kill();
            this.resetThink();
            score++;
            this.scoreText.text = score;
            if(soundOn == true){
                this.gulp.play()
            }
        }
        else{
            this.backgroundMusic.stop();
            if(soundOn == true){
                this.burp.play()
            }
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