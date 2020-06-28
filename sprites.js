let playerSprite = makeSprite([
    " # ",
    "###",
]);

let alienSprite = [];
alienSprite[0] = [
    makeSprite([
        "# #",
        " # ",
        "###",
    ]),
    makeSprite([
        "# #",
        "###",
        " # ",
    ])
];
alienSprite[1] = [
    makeSprite([
        " # ",
        "###",
        "# #",
    ]),
    makeSprite([
        "# #",
        "###",
        " # ",
    ])
];
alienSprite[2] = [
    makeSprite([
        "###",
        "###",
        "# #",
    ]),
    makeSprite([
        "# #",
        "###",
        "###",
    ])
];

let levelSprite = makeSprite([
    "#   ### # # ### #  ",
    "#   #   # # #   #  ",
    "#   ##  # # ##  #  ",
    "#   #   # # #   #  ",
    "### ###  #  ### ###",
]);

// font from https://fontstruct.com/fontstructions/show/505936/11x7_smaller_dot_matrix
let numSprite = [];
numSprite[0] = makeSprite([
    "  ###  ",
    " #   # ",
    "#    ##",
    "#   # #",
    "#  #  #",
    "# #   #",
    "##    #",
    " #   # ",
    "  ###  ",
]);
numSprite[1] = makeSprite([
    "  ##   ",
    " # #   ",
    "   #   ",
    "   #   ",
    "   #   ",
    "   #   ",
    "   #   ",
    "   #   ",
    "   #   ",
    "   #   ",
    " ##### ",
]);
numSprite[2] = makeSprite([
    " ##### ",
    "#     #",
    "      #",
    "     # ",
    "    #  ",
    "   #   ",
    "  #    ",
    " #     ",
    "#      ",
    "#      ",
    "#######",
]);
numSprite[3] = makeSprite([
    " ##### ",
    "#     #",
    "      #",
    "      #",
    "     # ",
    " ####  ",
    "     # ",
    "      #",
    "      #",
    "#     #",
    " ##### ",
]);
numSprite[4] = makeSprite([
    "     # ",
    "    ## ",
    "   # # ",
    "  #  # ",
    " #   # ",
    "#    # ",
    "#######",
    "     # ",
    "     # ",
    "     # ",
    "     # ",
]);
numSprite[5] = makeSprite([
    "#######",
    "#      ",
    "#      ",
    "#      ",
    "#####  ",
    "     # ",
    "      #",
    "      #",
    "      #",
    "#    # ",
    " ####  ",
]);
numSprite[6] = makeSprite([
    "  #### ",
    " #    #",
    "#      ",
    "#      ",
    "# ###  ",
    "##   # ",
    "#     #",
    "#     #",
    "#     #",
    " #   # ",
    "  ###  ",
]);
numSprite[7] = makeSprite([
    "#######",
    "      #",
    "      #",
    "     # ",
    "    #  ",
    "   #   ",
    "  #    ",
    " #     ",
    "#      ",
    "#      ",
    "#      ",
]);
numSprite[8] = makeSprite([
    "  ###  ",
    " #   # ",
    "#     #",
    "#     #",
    " #   # ",
    "  ###  ",
    " #   # ",
    "#     #",
    "#     #",
    " #   # ",
    "  ###  ",
]);
numSprite[9] = makeSprite([
    " ##### ",
    "#     #",
    "#     #",
    "#     #",
    "#     #",
    " ######",
    "      #",
    "      #",
    "      #",
    "     # ",
    " ####  ",
]);

let gameoverSprite = makeSprite([
    " ###    #   #   # ####",
    "#      # #  ## ## #   ",
    "#     #   # # # # #   ",
    "#     #   # #   # ### ",
    "#  ## ##### #   # #   ",
    "#   # #   # #   # #   ",
    " ###  #   # #   # ####",
    "                      ",
    " ###  #   # #### #### ",
    "#   # #   # #    #   #",
    "#   # #   # #    #   #",
    "#   # #   # ###  #### ",
    "#   # #   # #    # #  ",
    "#   #  # #  #    #  # ",
    " ###    #   #### #   #",
]);

function drawSprite(x, y, s, col) {
    for (let sy = 0; sy < s.length; sy++) {
        for (let sx = 0; sx < s[sy].length; sx++) {
            let c = s[sy].charAt(sx);
            if (c == '#' && x+sx >= 0 && x+sx <= 23 && y+sy >= 0 && y+sy <= 23) {
                game.setDot(x+sx, y+sy, col);
            }
        }
    }
}

// TODO: this could "compile" the sprite into a function that just does game.setDot()
// on the dot positions, for efficiency
function makeSprite(s) {
    return s;
}
