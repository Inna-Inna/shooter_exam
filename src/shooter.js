require("./styles/style.scss");
//require("./game_model.js");
var jQuery = require("jquery");

(function(window, $){
    'use strict';

    var $start = $('#start'),
        $overlay = $('#overlay'),
        $overlayWin = $('#overlay-win'),
        $overlayLose = $('#overlay-lose'),
        $text = $('#text'),
        $userTime = $('#user-time'),
        $reward = $('#price'),
        $totalScore = $('#total-score'),
        $levelNumber = $('#level-number'),
        $gunmanSpeed = $('#gunman-time'),
        $audioIntro = $('#audio-intro'),
        $audioFire = $('#audio-fire'),
        $audioDeath = $('#audio-death'),
        $audioWin = $('#audio-win'),
        $audioShot = $('#audio-shot'),
        userClick = false,
        notFoul = false,
        temp = '';


    function Game(speed, gunman){

        var self = this;
        self.gunman = $(gunman);
        self.speed = speed;
        self.score = 0;
        self.userTime = (0).toFixed(2);
        self.userTimeOver = false;
        self.level = 0;
        self.win = false;

        self.scorePull = {
            1300: 2800,
            1100: 3700,
            900:5300,
            700:5500,
            500:6500,
            300:8000
        };

        self.gameStart = function () {
            $start.click(function(){
                $overlay.css('visibility','hidden');
                self.start();
            })
        };

        self.start = function(){

            self.gunmanSpeed = (self.speed/1000).toFixed(2);
            $userTime.html(self.userTime);
            $gunmanSpeed.html(self.gunmanSpeed);
            $reward.html(self.scorePull[self.speed]);
            $totalScore.html(self.score);

            self.level +=1;
            $levelNumber.html(self.level);

            $audioIntro.get(0).play();
            self.gunman.css('display','inline-block').addClass("walk");

            setTimeout(function(){
                $audioIntro.get(0).pause();
                self.fire();
            },8000);
        };

        self.fire = function(){
            self.gunman.removeClass('walk').addClass('fired');
            $audioFire.get(0).play();
            $text.html('FIRE!!').css('display','inline-block');
            self.time = new Date();
            self.startFireTime = self.time.getTime();
            notFoul = true;
            self.gunmanShoot();
            self.userShoot();
            setTimeout(function(){
                if (self.win){self.nextLevel();}
            },self.speed+2500)
        };

        self.gunmanShoot = function(){
            $audioShot.get(0).play();
            temp = setTimeout(function(){
                self.gunman.removeClass('fired').addClass('shoot');
                $userTime.html('Over');
                self.userTimeOver = true;
                $text.html('YOU LOSE!!').css('display','inline-block');
                self.win = false;
                $overlayLose.addClass('overlay-lose');
                $audioDeath.get(0).play();
                setTimeout(function(){self.gameOver();}, self.speed+5000)
            }, self.speed );
        };

        self.userShoot = function(){

            self.gunman.click(function(){

                userClick = true;

                clearTimeout(temp);

                if ( userClick && notFoul && !self.userTimeOver){
                    self.gunman.removeClass('fired').addClass('killed');
                    $text.html('YOU WIN!!').css('display','inline-block');
                    self.userTimer();
                    self.countScore();
                    $audioWin.get(0).play();
                    $overlayWin.css('visibility','visible');
                    self.win = true;

                } else if (userClick && !notFoul && !self.userTimeOver) {
                    $text.html('FOUL!!').css('display','inline-block');

                } else {
                    $text.html('YOU LOSE!!').css('display','inline-block');
                    $userTime.html('Over');
                }
            })
        };

        self.userTimer = function(){
            self.d = new Date();
            self.newTime = self.d.getTime();
            self.userEndFire = ((self.newTime - self.startFireTime)/1000).toFixed(2);
            $userTime.html(self.userEndFire);
        };

        self.countScore = function(){
            self.totalScore = self.score + self.scorePull[self.speed];
            $totalScore.html(self.totalScore);
        };

        self.nextLevel = function(){
            self.speed -= 200;
            self.userTime = (0).toFixed(2);
            self.userTimeOver = false;
            $text.removeAttr( 'style' );
            self.gunman.removeAttr( 'style').removeClass('killed');
            $overlayWin.removeAttr( 'style' );
            userClick = false;
            notFoul = false;
            self.win = false;
            self.score = self.totalScore;
            self.start();
        };

        self.gameOver = function(){
            if (self.level == 6 || self.win === false){
                self.speed = speed;
                self.score = 0;
                self.userTime = (0).toFixed(2);
                self.userTimeOver = false;
                $text.removeAttr( 'style' );
                self.gunman.removeAttr( 'style').removeClass('killed').removeClass('fired')
                    .removeClass('shoot').removeClass('walk');
                $overlayWin.removeAttr( 'style' );
                $overlayLose.removeClass('overlay-lose');
                userClick = false;
                notFoul = false;
                self.win = false;
                $overlay.css('visibility','visible');
                self.level = 0;
            }
        };
    }

    var game = new Game(1300, '#gunman1');
    game.gameStart();

}(window, jQuery));