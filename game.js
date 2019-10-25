var board = document.getElementsByClassName('chessboard')[0],
    spaces = document.getElementsByClassName('space'),
    moveNum = 0;

class Piece {
    constructor(y, white, symbol) {
        this.y = parseInt(y);
        this.white = !!white;
        this.symbol = symbol.toString();
        spaces[y].innerHTML = this.symbol;

        this.move = function(n) {
            moveNum++;
            let lY = this.y;
            spaces[this.y].innerHTML = '';
            this.y = parseInt(n);
            spaces[this.y].innerHTML = this.symbol;
            document.getElementsByTagName('p')[0].innerHTML += moveNum + ': ' + this.symbol + ' e' + (lY + 1) + ' - e' + (this.y + 1) + '<br>';
        };
    }
}

class King extends Piece {
    constructor(y, white) {
        super(y, !!white, !white ? '&#9818;' : '&#9812;');

        this.getValid = function() {
            let a = [];
            if (spaces[this.y - 1] && !spaces[this.y - 1].innerHTML) a.push(this.y - 1);
            if (spaces[this.y + 1] && !spaces[this.y + 1].innerHTML) a.push(this.y + 1);
            return a;
        };
    }
}

class Pawn extends Piece {
    constructor(y, white) {
        super(y, !!white, !white ? '&#9821;' : '&#9817;');

        this.getValid = function() {
            let a = [];
            if (this.white) {
                if (spaces[this.y - 1] && !spaces[this.y - 1].innerHTML) {
                    a.push(this.y - 1);
                    if (this.y == 6 && !spaces[this.y - 2].innerHTML) a.push(this.y - 2);
                } else {
                    return a;
                }
            } else {
                if (spaces[this.y + 1] && !spaces[this.y + 1].innerHTML) {
                    a.push(this.y + 1);
                    if (this.y == 1 && !spaces[this.y + 2].innerHTML) a.push(this.y + 2);
                } else {
                    return a;
                }
            }
            return a;
        };
    }
}

var pieces = [
    new King(0, false),
    new Pawn(1, false),
    new Pawn(6, true),
    new King(7, true)
];

class Selector {
    constructor(white) {
        this.selected = undefined;
        this.canSelect = true;
        this.white = !!white;

        this.select = function(p) {
            this.deselect();
            this.selected = p;
            var v = p.getValid();
            for (const tiles of v) {
                spaces[tiles].className += ' valid';
            }
        };

        this.deselect = function() {
            this.selected = undefined;
            for (let i = 0; i < spaces.length; i++) {
                spaces[i].classList.remove('valid');
            }
        };
    }
}
var selector = new Selector(true);

function clicked(n) {
    if (!selector.canSelect) return;
    let p = pieces.find((p) => p.y == n);
    if (p && p.white == selector.white) {
        selector.select(p);
    } else if (selector.selected && spaces[n].className.includes('valid')) {
        selector.selected.move(n);
        selector.deselect();
        nextRound();
    } else {
        selector.deselect();
    }
}

function nextRound() {
    selector.canSelect = false;
    var opP = pieces.filter((p) => p.white != selector.white);
    var p = undefined;
    var pos = undefined;

    while (!pos && pos != 0) {
        p = opP[Math.floor(Math.random() * opP.length)];
        let v = p.getValid();
        if (!v.length) {
            opP.splice(opP.indexOf(p), 1);
            continue;
        }
        pos = v[Math.floor(Math.random() * v.length)];
    }

    setTimeout(() => {
        p.move(pos);
        selector.canSelect = true;
    }, 1000);
}