import kaboom from './kaboom/dist/kaboom.mjs.js';


kaboom({
    global: true,
    fullscreen: true,
    scale: 2, 
    debug: true,
    background: [0, 0, 0, 1],
});

//sprite objects, blocks to build world
loadSprite('coin', 'assets/coin.png');
loadSprite('brick', 'assets/brick.png');
loadSprite('block', 'assets/box.png');
loadSprite('mario', 'assets/mario.png');
loadSprite('mushroom', 'assets/mushroom.png');
loadSprite('evil-mushroom', 'assets/evil-mushroom.png');
loadSprite('surprise-box', 'assets/surprise-box.png');
loadSprite('pipe', 'assets/pipe.png');

//sounds to play during gameplay
// loadRoot('https://dazzling-vacherin-8cb912.netlify.app/assets/');
loadRoot('./assets/');
loadSound('jump', 'marioJump.mp3');
loadSound('theme', 'mainTheme.mp3');



scene('game', ({ score, count }) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    //create maps for the world
    const map = [
        '                                                                           ',
        '                                           %%%%                            ',
        '                                                                           ',
        '                                                          ===              ',
        '                                                                           ',
        '     *   ===%=                          %===%%==*=             %%%         ',
        '                                  ===                   =                  ',
        '                                                        =                  ',
        '        *           ^   ^                             ^ =                ? ',
        '==============================   ========================    ==============',
    ];

    //configuring the map to display
    const levelConfig = {
        width: 20,
        height: 20,
        '=': () => [sprite('brick'), solid(), area()],
        '*': () => [sprite('coin'), area(), 'coin'],
        '%': () => [sprite('surprise-box'), solid(), area(), 'coin-surprise'],
        '#': () => [sprite('surprise-box'), solid(), area(), 'mushroom-surprise'],
        '^': () => [sprite('evil-mushroom'), solid(), area(), 'evil-mushroom', body()],
        '?': () => [sprite('pipe'), solid(), area()],
        '+': () => [sprite('block'), solid(), area()],
        '@': () => [sprite('mushroom'), solid(), area(), 'mushroom', body()],
    };

    const gameLevel = addLevel(map, levelConfig);

    const mario = add([
        sprite('mario'), 
        solid(), 
        area(),
        pos(30, 0),
        body(),
        origin('bot'),
        'mario'
    ]);

    //moving mario
    const marioSpeed = 120;
    const marioJumpHeight = 600;
    const coinScore = 200;
    

    onKeyDown('left', () => {
        mario.move(-marioSpeed, 0);
    });

    onKeyDown('right', () => {
        mario.move(marioSpeed, 0);
    });

    onKeyPress('space', () => {
        if (mario.isGrounded()) {
            mario.jump(marioJumpHeight);
            play('jump');
        }
    });

    //mario actions
    mario.onCollide('coin', (obj) => {
        destroy(obj);
        scoreLabel.value += coinScore;
        scoreLabel.text = scoreLabel.value;
        console.log(mario.isGrounded());
    });

    mario.onCollide('coin-surprise', (obj) => {
        console.log(mario.isGrounded());
        if (obj.isBottom()) {
            gameLevel.spawn('*', obj.gridPos.sub(0, 1));
            gameLevel.spawn('+', obj.gridPos.sub(0, 0));
            destroy(obj);
        }
    });

    // mario.onCollide('headbump', (obj) => {
    //     if (obj.is('coin-surprise')) {
    //         gameLevel.spawn('*', obj.gridPos.sub(0, 1));
    //         gameLevel.spawn('+', obj.gridPos.sub(0, 0));
    //         destroy(obj);
    //     }
    //     if (obj.is('mushroom-surprise')) {
    //         gameLevel.spawn('@', obj.gridPos.sub(0, 1));
    //         gameLevel.spawn('+', obj.gridPos.sub(0, 0));
    //         destroy(obj);
    //     }
    // });

    //moving the mushrooms both evil and powerups
    const mushroomMove = 20;
    action('mushroom', (e) => {
        e.move(mushroomMove, 0);
    });

    action('evil-mushroom', (e) => {
        e.move(-mushroomMove, 0);
    });

    // mario.collides('mushroom', (e) => {
    //     destroy(e);
    //     mario.biggify(10);
    // });




    // play('theme');

    const username = add([
        text('MARIO', {
            size: 18,
            width: 320, 
            font: 'sinko', 
        }),
        pos(30, 6),
        fixed()
    ]);

    console.log(username);
    const scoreLabel = add([
        text(score, {
            size: 18,
            width: 320, 
            font: 'sinko', 
        }),
        pos(60, 30),
        layer('ui'),
        fixed(),
        {
            value: score
        }
    ]);

    add([sprite('coin'), pos(200, 32), layer('ui'), fixed()]);
    
    const coinCount = add([
        text('x' + count, {
            size: 18,
            width: 320, 
            font: 'sinko', 
        }),
        pos(220, 30),
        fixed(),
        layer('ui'),
        {
            value: count
        }
    ]);

    mario.action(() => {
        camPos(mario.pos);
    });
});

go('game', { score: 0, count: 0 });
