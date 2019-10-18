/*
 * @Date: 2019-09-28 15:36:17
 * @LastEditors: Cloud
 * @LastEditTime: 2019-10-11 21:07:15
 */


// 产生一个全局变量总比紧耦合要强
var ifEnd = false;
var planes = document.getElementById('planes');
var container = document.querySelector('#container');
var offsetleft = container.offsetLeft;
var startButton = document.querySelector('#start-con');
var buttonLeft = startButton.offsetLeft;
var buttonTop = startButton.offsetTop;
var scoreElement = document.getElementById('score');
var endBoard = document.getElementById('end-board');
var suspendBoard = document.getElementById('suspend-board');
var restart = document.getElementsByClassName('reStart')[0];
var smallEnemys = [];
var middleEnemys = [];
var bigEnemys = [];
var score =0;

function Game() {
    this.scoreBoard = document.querySelector('#score-board');
    startButton.onclick = function(e) {
        this.init();
        //取消冒泡
        e.stopPropagation();
    }.bind(this);
}
Game.prototype = {
    constructor: Game,
    // TODO:游戏进行时初始化，游戏的控制中心😁
    init: function() {
        startButton.style.display = 'none';
        planes.style.backgroundImage = "url('images/bacOn.png')";
        this.scoreBoard.style.display = 'block';
        scoreElement.innerHTML = score;
        // 初始化我方飞机,包括子弹的产生和发射😘
        var minePlane = new Plane();
        minePlane.launchBullet();

        // 初始化敌方飞机,飞机具有了下坠和检测撞击等方法
        //小飞机
        this.smallTimerId = setInterval(function(){
            // 这种产生的是对象，具有方法属性等
            smallEnemys.push(new Enemy(35,25,'images/small.png'));
            for(var i = 0;i<smallEnemys.length;i++) {
                smallEnemys[i].fall();
            }
        },1000);
        //中飞机
        this.middleTimerId = setInterval(function() {
            middleEnemys.push(new Enemy(46,60,'images/middle.png'));
            // smallEnemy.fall();
            for(var i = 0;i<middleEnemys.length;i++) {
                middleEnemys[i].fall();
            }
        },1000);
        //大飞机
        this.bigTimerId = setInterval(function() {
            bigEnemys.push(new Enemy(110,164,'images/big.png'));
            for(var i = 0;i<middleEnemys.length;i++) {
                bigEnemys[i].fall();
            }
        },1000);

        // 生产的每个飞机的对象名引用，会在后一个声明的引用覆盖前者，所以当前对对象名的操作仅仅有三个，那么如何保证屏幕所有的敌方飞机能够
        // 暂停呢，那么可以使用querySelector()对元素对象的引用，该元素对象和前者声明的对象引用不同，他不具备任何方法，唯一有用的是个timerId，
        // 可以达到暂停的效果，清除了下坠的定时效果，但是再也无法继续下坠了，因为对这个飞机的引用对象丢失了，呵呵哈哈哈，为了不追求完美，同时省略
        // 一些时间，可以把生成的对象存储在一个数组中，然后遍历他们，但是这样慢慢的内存将会溢满，然后还有自己清楚对象的

        // 暂停
        container.onclick = function() {
            // 还是需要解决如何使得敌军战机暂停
            clearInterval(game.smallTimerId);
            clearInterval(game.middleTimerId);
            clearInterval(game.bigTimerId);
            for(var i = 0;i<smallEnemys.length;i++) {
                clearInterval(smallEnemys[i].suspend());
            }
            for(var i = 0;i<middleEnemys.length;i++) {
                clearInterval(middleEnemys[i].suspend());
            }
            for(var i = 0;i<bigEnemys.length;i++) {
                clearInterval(bigEnemys[i].suspend());
            }
            suspendBoard.style.display = 'block';
            container.onmousemove = null;

        }.bind(this);
        // 继续
        suspendBoard.children[0].onclick = function(e) {
            e.stopPropagation();
            // 初始化敌方飞机,飞机具有了下坠和检测撞击等方法
            //小飞机
            this.smallTimerId = setInterval(function(){
                // 这种产生的是对象，具有方法属性等
                smallEnemys.push(new Enemy(35,25,'images/small.png'));
                for(var i = 0;i<smallEnemys.length;i++) {
                    smallEnemys[i].fall();
                }
            },1000);
            //中飞机
            this.middleTimerId = setInterval(function() {
                middleEnemys.push(new Enemy(46,60,'images/middle.png'));
                // smallEnemy.fall();
                for(var i = 0;i<middleEnemys.length;i++) {
                    middleEnemys[i].fall();
                }
            },1000);
            //大飞机
            this.bigTimerId = setInterval(function() {
                bigEnemys.push(new Enemy(110,164,'images/big.png'));
                for(var i = 0;i<middleEnemys.length;i++) {
                    bigEnemys[i].fall();
                }
            },1000);
            
            suspendBoard.style.display = 'none';
            container.onmousemove = function(e){
                // 首先planes是个元素，并非对象
                minePlane.mouse(e);
            }
        }.bind(this);
        // 重新开始
        suspendBoard.children[1].onclick = function() {
            location.reload();
        }
        // 回到主页
        suspendBoard.children[2].onclick = function() {
            location.reload();
        }
    }
}



// 我方战机
// 构造方法具有初始化自身，发射子弹
function Plane() {
    this.mine = document.createElement('div');
    this.mine.className = 'minePlane';//🤞
    this.mine.style.width = '65px';
    this.mine.style.height = '80px';
    this.mine.style.position = 'absolute';
    this.mine.style.backgroundImage = "url('images/mine.gif')";
    this.mine.style.cursor = 'pointer';
    this.mine.style.left =  (buttonLeft -10)+ 'px';
    this.mine.style.top = (buttonTop -10) + 'px';
    planes.appendChild(this.mine);
    //在指定的视口监听鼠标移动事件,飞机跟着鼠标移动
    container.onmousemove = function(e){
        this.mouse(e);
    }.bind(this);
}
Plane.prototype = {
    constructor: Plane,
    // 需要元素调用
    mouse: function(e) {
        // 飞机的位置,针对自适应设备
        this.mine.style.left =(e.pageX-offsetleft-32.5) + 'px';
        var pageY = e.clientY;
        if(pageY>550) {
            pageY=550;
        }
        this.mine.style.top = (pageY-40) + 'px';
        // console.log(this.mine.style.left,this.mine.style.top);
        // return this.mine.array = [this.mine.style.left,this.mine.style.top];
    },
    // 子弹生产,接下来，可以把子弹传递给飞机，在飞机位置处完成子弹发射
    launchBullet: function() {
        var that = this;
        // 生产子弹😊
        window.timerIdproduce = setInterval(function(){produce()},100);
        produce();
        function produce() {
            // 为什么不能够使用this.bullet = new Image(),这样看起来会产生一个子弹，然后子弹上升的时候移动的是另外一个子弹
            // 使用var bullet = new Image(),只产生一个子弹，并且后面的上升操作的也是这个子弹，然后定时器定时产生子弹，后面的上升函数针对这个子弹
            var bullet = new Image();
            bullet.className = 'bullet';//🤞
            bullet.src = 'images/bullet.png';
            bullet.style.position = 'absolute';
            bullet.style.left = (Number(that.mine.style.left.replace('px',''))+32.5) + 'px';
            bullet.style.top =  (Number(that.mine.style.top.replace('px',''))-40) + 'px';
            planes.appendChild(bullet);
            //子弹上升,递归调用
            function riseBullet() {
                if(!ifEnd) {
                    if(bullet.offsetTop < 0) {
                        planes.removeChild(bullet);
                        return;
                    }    
                    bullet.style.top = bullet.offsetTop - 10 + 'px';  
                    // 发射子弹❤
                    window.timer = requestAnimationFrame(riseBullet);//可以使用time = new Date().getSecond（）代替，time%5 == 0时，上升子弹，调用递归函数
                }      
            };
            riseBullet();
        }
    },
    bulletImpact: function() {
        
    }
}

// 敌方战机
// 构造函数具有初始化自身,下坠，暂停下坠，与子弹，飞机碰撞检测
function Enemy(width,height,backgroundImage) {
    this.height = height;
    this.width = width;
    this.enemy = document.createElement('div');
    this.enemy.className = 'enemy';//✌
    this.enemy.style.width = width + 'px';
    this.enemy.style.height = height + 'px';
    this.enemy.style.position = 'absolute';
    this.enemy.style.backgroundImage = `url(${backgroundImage})`;
    var randomX = Math.floor(Math.random()*container.clientWidth);
    this.enemy.style.left = Math.max(0,(randomX - width)) + 'px';
    planes.appendChild(this.enemy);
}
// 敌方战机的方法，自由落体运动
Enemy.prototype = {
    constructor: Enemy,
    speed: [10,50,100],
    // 飞机下坠🤣,抽象问题具体化，从而找到思路
    fall: function() {
        this.enemy.timerId = setInterval(function() {
            this.enemy.style.top = this.enemy.offsetTop + 'px';
            if(this.enemy.offsetTop > (550-this.height)) {
                planes.removeChild(this.enemy);
            }
            this.enemy.style.top = (this.enemy.offsetTop + 15) + 'px'; 
            // 检测是否碰撞😊
            this.impactTest()
        }.bind(this),100);
    },
    // 飞机暂停下坠
    suspend: function() {
        clearInterval(this.enemy.timerId);
    },
    //检测碰撞方式
    // 检测碰撞范围
    collision: function(enemyModule,mineModule) {
        var xenemymax = enemyModule.offsetLeft + enemyModule.clientWidth;
        var xenemymin = enemyModule.offsetLeft;
        var yenemymax = enemyModule.offsetTop + enemyModule.clientHeight;
        var yenemymin = enemyModule.offsetTop;
        var xminemax = mineModule.offsetLeft + mineModule.clientWidth;
        var xminemin = mineModule.offsetLeft;
        var yminemin = mineModule.offsetTop;
        var yminemax = mineModule.offsetTop-mineModule.clientHeight;
        // 分析撞击的情况
        if(xminemax >= xenemymin && xminemin<= xenemymax && yminemin <= yenemymax && yminemax <=yenemymin) {
            return true;
        }
    },
    // 碰撞检测
    impactTest: function() {
        this.planeEnemy();
        this.bulletEnemy();
    },
    // 飞机与敌方战机检测😂
    planeEnemy: function() {
        var mine = document.querySelector('.minePlane');
        if(this.collision(this.enemy,mine)) {
            // game over 画面停止，得分弹窗
            clearInterval(game.smallTimerId);
            clearInterval(game.middleTimerId);
            clearInterval(game.bigTimerId);
            mine.style.backgroundImage = `url('images/mineImpact.gif')`;

            if(this.enemy.style.width === '46px') {
                this.enemy.style.backgroundImage = `url('images/middleImpact.gif')`;
            } else if(this.enemy.style.width === '35px') {
                this.enemy.style.backgroundImage = `url('images/smallImpact.gif')`;
            } else if(this.enemy.style.width === '110px'){
                this.enemy.style.backgroundImage = `url('images/bigImpact.gif')`;
            };
            // 解除绑定
            container.onmousemove = null;
            // 弹出结束框
            endBoard.style.display = 'block';
            scoreElement.parentNode.style.display = 'none';
            endBoard.children[1].innerHTML = score;
            // 再来一局
            restart.onclick = function(e) {
                location.reload();
                e.stopPropagation();
            }
        }
    },
    // 子弹与地方战机检测
    bulletEnemy: function() {
        var bullet = document.querySelectorAll('.bullet');
        
        for(var i=0;i<bullet.length;i++) {
            debugger;
            if(this.collision(this.enemy,bullet[i])) {
                // 子弹清除，敌飞机毁坏，滞留0.2s后画面消失
                // TODO:大飞机需要更多的子弹才能够击怀
                if(this.enemy.style.width === '46px') {
                    this.enemy.style.backgroundImage = `url('images/middleImpact.gif')`;
                    score += 50;
                    clearInterval(this.enemy.timerId);

                } else if(this.enemy.style.width === '35px') {
                    this.enemy.style.backgroundImage = `url('images/smallImpact.gif')`;
                    score += 10;
                    clearInterval(this.enemy.timerId);
                } else if(this.enemy.style.width === '110px'){
                    this.enemy.style.backgroundImage = `url('images/bigImpact.gif')`;
                    score += 100;
                    clearInterval(this.enemy.timerId);
                };
                scoreElement.innerHTML = score;
                setTimeout(function() {planes.removeChild(this.enemy)}.bind(this),1000);
            }
        }
    },
}


var game = new Game();//调用game

