kaboom({
    global: true,
    fullscreen: true,
    scale: 2.5, 
    debug: true,
    clearColor: [0, 0, 0, 1],
});

//sprites, blocks to build world
loadSprite('coin', 'assets/coin.png');
loadSprite('brick', 'assets/brick.png');
loadSprite('block', 'assets/box.png');
loadSprite('mario', 'assets/mario.png');
loadSprite('mushroom', 'assets/mushroom.png');
loadSprite('evil-mushroom', 'assets/evil-mushroom.png');
loadSprite('surprise-box', 'assets/surprise-box.png');
loadSprite('pipe', 'assets/pipe.png');

//sounds to play during gameplay
loadRoot('https://dazzling-vacherin-8cb912.netlify.app/assets/');
// loadRoot('http://localhost:5501/assets/');
loadSound('jump', 'marioJump.mp3');
loadSound('theme', 'mainTheme.mp3');



scene('game', () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const map = [
        '                                     ',
        '                                     ',
        '                                     ',
        '                                     ',
        '                                     ',
        '                 ****                ',
        '                                     ',
        '                                     ',
        '                 ++++                ',
        '                                     ',
        '                                     ',
        '     **  +%+#+                       ',
        '                                     ',
        '                         ?           ',
        '                    ^  ^             ',
        '===========================    ======',
    ];

    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ]);

    const marioSpeed = 120;
    const marioJumpHeight = 400;

    keyDown('left', () => {
        player.move(-marioSpeed, 0);
    });

    keyDown('right', () => {
        player.move(marioSpeed, 0);
    });

    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(marioJumpHeight);
            play('jump');
        }
    });

    player.on('headbump', (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('*', obj.gridPos.sub(0, 1));
            destroy(obj);
        }
    });

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('brick'), solid()],
        '*': [sprite('coin')],
        '%': [sprite('surprise-box'), solid(), 'coin-surprise'],
        '#': [sprite('surprise-box'), solid(), 'mushroom-surprise'],
        '^': [sprite('evil-mushroom'), solid()],
        '?': [sprite('pipe'), solid()],
        '+': [sprite('block'), solid()],
    };

    play('theme');
    const gameLevel = addLevel(map, levelConfig);
});

start('game');
