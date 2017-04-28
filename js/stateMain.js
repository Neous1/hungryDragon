var StateMain={    
    
   preload:function(){
       
       if (screen.width < 1500) {
            game.scale.forceOrientation(true, false);
        }
       // Dragon
       game.load.spritesheet("dragon", "images/main/dragon.png", 120, 85, 4);
       game.load.image("background", "images/main/background.png");
       game.load.spritesheet("candy", "images/main/candy.png", 52, 50, 8);
    },
       
    //CREATE *****************************************///////////////////////////////////////////
    create:function(){
        
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
        
        game.physics.enable([this.dragon, this.candies], Phaser.Physics.ARCADE);
        this.dragon.body.immovable = true;
        
        this.dragon.body.gravity.y = 500;
        

        
        this.setListeners();
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
    
     wrongWay: function () {

        document.getElementById("wrongWay").style.display = "block";

    },
        
     rightWay: function () {
        document.getElementById("wrongWay").style.display = "none";
    },
    
    flap: function(){
        this.dragon.body.velocity.y = -350;
    },
      
    
    onEat: function(dragon, candy){
        candy.kill();
    },
    // UPDATE *******************************///////////////////////////////////////////
    
    update: function(){
        game.physics.arcade.collide(this.dragon, this.candies,null, this.onEat);
    
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