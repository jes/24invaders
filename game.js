let playery = 22;
let shieldy = 20;
let player = {};
let shields = {};
let aliens = {};
let bullet = {};
let gamestate;
let leveltransition = {};

function create(game) {
    player = {
        x: 12,
        score: 0,
        level: 0,
        gameover: false,
    };
    bullet = {x: -1, y: -1};

    aliens = createAliens();

    shields = createShields();

    nextLevel();
}

function createShields() {
    shield_xs = [1,2,3, 7,8,9, 14,15,16, 20,21,22];
    let shields = {};
    for (x of shield_xs) {
        shields[x] = 1;
    }
    return shields;
}

function createAliens() {
    let xoffset = 4;
    let yoffset = 4;
    let w = 4;
    let h = 3;

    let aliens = {
        x: 0,
        y: 0,
        dir: 1,
        positions: [],
        bullets: [],
        frame: 0,
    };

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            aliens.positions.push([x*xoffset, y*yoffset, alienSprite[y]]);
        }
    }

    return aliens;
}

function update(game) {
    gamestate(game);
}

function maingame(game) {
    // draw aliens (XXX: must be drawn before updateBullet for collision detection)
    drawAliens(Color.Red);
    updateBullet();
    drawAliens(Color.Gray); // undraw aliens...

    // update aliens at a speed dependent on level
    let slowness = 10 - player.level;
    if (slowness < 2)
        slowness = 2;
    if (game.getFrameCount() % slowness == 0)
        updateAliens();

    updateAliensBullets();

    // draw player
    drawSprite(player.x-1, playery, playerSprite, Color.Green);

    // draw bullet
    if (bullet.y != -1) {
        game.setDot(bullet.x, bullet.y, Color.Orange);
    }

    // draw player's shields
    for (let shieldx in shields) {
        game.setDot(shieldx, shieldy, Color.Green);
    }

    // draw aliens' bullets
    for (let i = 0; i < aliens.bullets.length; i++) {
        game.setDot(aliens.bullets[i].x, aliens.bullets[i].y, Color.Orange);
    }

    // draw aliens
    drawAliens(Color.Red);

    game.setText("Score: " + player.score + " Level: " + player.level);
}

function drawAliens(c) {
    for (let i = 0; i < aliens.positions.length; i++) {
        let p = aliens.positions[i];
        if (aliens.y + p[1] < 24)
            drawSprite(aliens.x+p[0], aliens.y+p[1], p[2][aliens.frame], c);
    }
}

function drawNewLevel(game) {
    let xoff = Math.floor(leveltransition.frames/4)%2;
    let yoff = Math.floor(leveltransition.frames/2);

    drawSprite(xoff+2, yoff-5, levelSprite, Color.Black);
    if (player.level < 10) {
        drawSprite(xoff+8, yoff+2, numSprite[player.level], Color.Black);
    } else {
        drawSprite(xoff+4, yoff+2, numSprite[Math.floor(player.level/10)], Color.Black);
        drawSprite(xoff+12, yoff+2, numSprite[player.level%10], Color.Black);
    }

    for (let y = 0; y < 24; y++) {
        game.setDot(0, y, Color.Red);
        game.setDot(23, y, Color.Red);
    }

    leveltransition.frames++;
    if (leveltransition.frames > 60)
        gamestate = maingame;

    coolColours();

    game.setText("Score: " + player.score + " Level: " + player.level);
}

// turn a red into cool rainbow effects
function coolColours() {
    let colourcycle = [Color.Red, Color.Orange, Color.Yellow, Color.Green, Color.Blue, Color. Indigo, Color.Violet, Color.Gray, Color.Gray, Color.Gray, Color.Gray, Color.Gray, Color.Gray];
    for (let y = 0; y < 24; y++) {
        for (let x = 0; x < 24; x++) {
            if (game.getDot(x, y) == Color.Red) {
                let n = (x + y - game.getFrameCount()) % colourcycle.length;
                if (n < 0) n += colourcycle.length;
                game.setDot(x, y, colourcycle[n]);
            }
        }
    }
}

function drawGameOver(game) {
    for (let y = 17; y < 24; y++) {
        for (let x = 0; x < 24; x++) {
            game.setDot(x, y, Color.Red);
        }
    }
    drawSprite(1, 1, gameoverSprite, Color.Black);
    coolColours();
    game.setText("Score: " + player.score + " Level: " + player.level + " GAME OVER");
}

// update the player's bullet
function updateBullet() {
    if (bullet.y == -1)
        return;

    bullet.y--;
    if (bullet.y == -1)
        return;

    // collision with player's shields?
    if (bullet.y == shieldy && shields[bullet.x]) {
        // TODO: add explosion at bullet.x,bullet.y
        bullet.y = -1;
        delete shields[bullet.x];
        return;
    }

    // collision with aliens
    // HACK: read out colour for already-drawn aliens (we do this so that
    // we get pixel-based collision instead of bounding-box collision)
    if (game.getDot(bullet.x, bullet.y) == Color.Red) {
        player.score += 100;
        killAlien(bullet.x, bullet.y);
        bullet.y = -1;
    }
}

function killAlien(x, y) {
    // find the 3x3 bounding box that (x,y) hits, and remove that alien
    for (let i = 0; i < aliens.positions.length; i++) {
        let p = aliens.positions[i];
        if (x >= aliens.x+p[0] && x <= aliens.x+p[0]+2 && y >= aliens.y+p[1] && y <= aliens.y+p[1]+2) {
            aliens.positions.splice(i, 1);
            break;
        }
    }

    // spawn new aliens if they're all dead
    if (aliens.positions.length == 0) {
        aliens = createAliens();
        shields = createShields();
        nextLevel();
        player.score += 100;
    }
}

function updateAliens() {
    aliens.x += aliens.dir;
    aliens.frame = (aliens.frame+1) % 2;
    for (let i = 0; i < aliens.positions.length; i++) {
        let p = aliens.positions[i];
        if (aliens.x+p[0] == 22 || aliens.x+p[0] == -1) {
            aliens.dir = -aliens.dir;
            aliens.x += aliens.dir;
            aliens.y++;
            break;
        }

        if (aliens.y+p[1] == 20) {
            gameOver();
        }
    }

    // shoot!
    if (Math.random() < 0.2) {
        // pick a random alien
        alienShoot(Math.floor(Math.random() * aliens.positions.length));
    }
}

function updateAliensBullets() {
    for (let i = 0; i < aliens.bullets.length; i++) {
        aliens.bullets[i].y++;
        if (aliens.bullets[i].y > 23) {
            aliens.bullets.splice(i, 1);
            i--;
            continue;
        }

        // collision with shields
        if (aliens.bullets[i].y == shieldy && shields[aliens.bullets[i].x]) {
            delete shields[aliens.bullets[i].x];
            aliens.bullets.splice(i, 1);
            i--;
            continue;
        }

        // collision with player
        if (aliens.bullets[i].y == 23 && Math.abs(aliens.bullets[i].x-player.x) <= 1) {
            gameOver();
        }
    }
}

function gameOver() {
    gamestate = drawGameOver;
}

function nextLevel() {
    player.level++;
    gamestate = drawNewLevel;
    leveltransition = {
        frames: 0,
    };
}

function onKeyPress(direction) {
    if (gamestate == maingame) {
        if (direction == Direction.Up) {
            shoot();
        } else if (direction == Direction.Left) {
            if (player.x > 1)
                player.x--;
        } else if (direction == Direction.Right) {
            if (player.x < 22)
                player.x++;
        }
    }
}

function alienShoot(i) {
    aliens.bullets.push({
        x: aliens.x + aliens.positions[i][0] + 1,
        y: aliens.y + aliens.positions[i][1] + 1,
    });
}

function shoot() {
    if (bullet.y != -1)
        return;

    bullet.x = player.x;
    bullet.y = playery;
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
};

let game = new Game(config);
game.run();
