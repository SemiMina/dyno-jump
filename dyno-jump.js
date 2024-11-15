const app = new PIXI.Application({
    backgroundColor: 0xcccccc,
    antialias: true,
    resizeTo: window,
});
document.body.appendChild(app.view);

const WIN_WIDTH = 500;
const WIN_HEIGHT = 650;

let board = new PIXI.Container();
app.stage.addChild(board);
changeWindowSize();

function changeWindowSize() {
    if (window.innerWidth > WIN_WIDTH) {
        board.x = (window.innerWidth - WIN_WIDTH) / 2;
    } else {
        board.x = 0;
    }

    if (window.innerHeight > WIN_HEIGHT) {
        board.y = (window.innerHeight - WIN_HEIGHT) / 2;
    } else {
        board.y = 0;
    }
}

window.addEventListener('resize', () => {
    changeWindowSize();
});

let mask = new PIXI.Graphics();
mask.beginFill(0x00bfff);
mask.drawRect(0, 0, WIN_WIDTH, WIN_HEIGHT);
mask.endFill();
board.addChild(mask);

let backGround = new PIXI.Graphics();
backGround.beginFill(0x00bfff, 0.4);
backGround.drawRect(0, 0, WIN_WIDTH, WIN_HEIGHT);
backGround.endFill();
board.addChild(backGround);

let backMountain = PIXI.Sprite.from('./images/mountain.png');
board.addChild(backMountain);
backMountain.scale.set(1);
backMountain.x = WIN_WIDTH * 0.5;
backMountain.y = WIN_HEIGHT * 0.8;
backMountain.anchor.set(0.5, 1);
backMountain.alpha = 0.6;
backMountain.mask = mask;

let frontMountain = PIXI.Sprite.from('./images/mountain.png');
board.addChild(frontMountain);
frontMountain.scale.set(1);
frontMountain.x = WIN_WIDTH * 0.5;
frontMountain.y = WIN_HEIGHT;
frontMountain.anchor.set(0.5, 1);
frontMountain.alpha = 1;
frontMountain.mask = mask;

let floor = PIXI.Sprite.from('./images/grass-floor.png');
board.addChild(floor);
floor.scale.set(1, 1);
floor.x = 0;
floor.y = WIN_HEIGHT;
floor.anchor.set(0.5, 1);
floor.alpha = 1;
floor.mask = mask;

let obstacle = PIXI.Sprite.from('./images/stone.png');
board.addChild(obstacle);
obstacle.scale.set(0.8);
obstacle.x = WIN_WIDTH;
obstacle.y = WIN_HEIGHT - 35;
obstacle.anchor.set(1);
obstacle.alpha = 1;
obstacle.mask = mask;

let player = PIXI.Sprite.from('./images/dyno.png');
board.addChild(player);
player.scale.set(0.5, 0.6);
player.x = 100;
player.y = WIN_HEIGHT - 45;
player.anchor.set(0.5, 1);
player.alpha = 1;

let btnContainer = new PIXI.Container();
board.addChild(btnContainer)

let button = PIXI.Sprite.from('./images/red-btn.png');
button.scale.set(0.5);
button.anchor.set(0.5, 0);
btnContainer.addChild(button);

let text = new PIXI.Text('JUMP', {
    fontFamily: 'Arial',
    fontSize: 60,
    fill: 'yellow',
    dropShadow: true,
    dropShadowColor: 'darkgreen',
});
text.anchor.set(0.5, -0.3);

btnContainer.addChild(text);
btnContainer.position.set(WIN_WIDTH * 0.5, WIN_HEIGHT + 10)
btnContainer.scale.set(0.5)

button.interactive = true;
button.on('pointertap', buttonTapHandler);

function buttonTapHandler(event) {
    gsap.to(player, 0.8, { 
        y: (WIN_HEIGHT - 400), yoyo: true, repeat: 1, ease: 'quat.out', 
        onComplete: playerLanded 
        }
    );
    button.interactive = false;
};

function playerLanded() {
    button.interactive = true;
};

function gameLoop() {
    floor.x -= 1.5;
    if (floor.x <= 0) floor.x = WIN_WIDTH;

    obstacle.x -= 1.5;
    if (obstacle.x <= 0) {
        obstacle.x += WIN_WIDTH + getRandom(100, WIN_WIDTH);
    };

    let isIntersect = obstacle.getBounds().intersects(player.getBounds());

    if (isIntersect) {
        player.visible = true;
        player.tint = 'tomato';
        gsap.to(player, 0.3, {
            alpha: 0, yoyo: true, repeat: 1, delay: 0.3, ease: 'sine.inOut',
            onStart: () => {
                button.interactive = false;
                button.off('pointertap', buttonTapHandler);
            }
        });
        return;
    }

    requestAnimationFrame(gameLoop);
};
gameLoop();

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
};
