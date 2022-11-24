'use strict'



const MINE = '🔥'
const FLAG = '🚩'
const NORMAL = 'imges/normal.png'
const LOSE = 'imges/lose.png'
const WIN = 'imges/win.png'

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3
}


var gIntervalTimerId
var timer = 0.000

function onInit() {
    renderLightBulbs()
    renderIcon()
    gBoard = createBoard()
    renderBoard(gBoard, '.board-container')

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3
    }
    timer = 0.000
}


//////////LEFT CLICK/////////////////
function cellClicked(ev, cellI, cellJ) {
    //first click

    if (gBoard[cellI][cellJ].isMine && gGame.shownCount === 0) {
        while (gBoard[cellI][cellJ].isMine) {
            gBoard = createBoard()
            renderBoard(gBoard, '.board-container')
        }
        // gBoard = createBoard()
        // renderBoard(gBoard, '.board-container')

    }

    //start game
    if (gGame.shownCount === 0) gIntervalTimerId = setInterval(startTimer, 1000);
    if (gGame.shownCount === 0) gGame.isOn = true

    //turn of click after loos
    if (gGame.shownCount > 0 && !gGame.isOn) return

    //ups the number of cells shown
    gGame.shownCount++

    //check for win
    if (checkWin()) gameOver('win')



    //modal
    var cell = gBoard[cellI][cellJ]
    if (cell.isMarked) return

    
    //check for lose
    if (cell.isMine && !cell.isShown) {
        gGame.lives -= 1
        console.log('in:', 'in')
        if(gGame.lives === 0){
            makeAllMinesApear()
            gameOver()
        }
        
    }
    
    //make cell apear
    if (!cell.isShown) cell.isShown = true


    //dom make cell apear
    // renderCell({i:cellI, j:cellJ},getStrHTML(cell))
    renderBoard(gBoard, '.board-container')

    //show squers around for empty squer

    var negCount = setMinesNegsCount(gBoard, cellI, cellJ)
    if (negCount === 0) {
        var negsAround = NegsAround(gBoard, cellI, cellJ)
        for (var i = 0; i < negsAround.length; i++) {
            var allEmpty = NegsAround(gBoard, negsAround[i].i, negsAround[i].j)
            for (var j = 0; j < allEmpty.length; j++) {
                var oneOfAllEmpty = allEmpty[j]
                if (!gBoard[oneOfAllEmpty.i][oneOfAllEmpty.j].isMarked) {
                    gBoard[oneOfAllEmpty.i][oneOfAllEmpty.j].isShown = true
                }
            }

        }

    }
    // else if(negCount > 0 ){
    //         var negsAround = NegsAroundPessNum(gBoard,cellI,cellJ)
    //         console.log('negsAround:', negsAround)
    //         console.log('gBoard:', gBoard)
    //         for(var i = 0 ; i < negsAround.length; i++){
    //             var oneNeg = negsAround[i]
    //             var negCount = setMinesNegsCount(gBoard, oneNeg.i, oneNeg.j)
    //             console.log('oneNeg:', oneNeg)
    //         }


    // }
    renderBoard(gBoard, '.board-container')




}


/////////////////////right click///////////////////////


function rightClick(el, rightCellI, rightCellJ) {
    //modal
    if (gGame.shownCount > 0 && !gGame.isOn) return
    if (checkWin()) gameOver('win')

    var cell = gBoard[rightCellI][rightCellJ]

    //make cell apear
    if (cell.isShown) return

    cell.isMarked = !cell.isMarked

    //dom make cell apear
    // renderCell({i:cellI, j:cellJ},getStrHTML(cell))
    renderBoard(gBoard, '.board-container')
    if (cell.isMarked) {
        gGame.markedCount++

    } else {
        gGame.markedCount--
    }
}



function gameOver() {
    if (checkWin()) renderIcon('win')
    else renderIcon('lose')
    clearInterval(gIntervalTimerId);
    gGame.isOn = false
}



function makeAllMinesApear() {
    var allMinesPoses = findAllMines()
    for (var i = 0; i < allMinesPoses.length; i++) {
        var mineCell = allMinesPoses[i]
        var cellToApear = gBoard[mineCell.i][mineCell.j]
        cellToApear.isShown = true
    }
    renderBoard(gBoard, '.board-container')
}

function findAllMines() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                var cellPos = { i: i, j: j }
                mines.push(cellPos)
            }
        }
    }
    return mines
}


function checkWin() {
    //TODO: make the thing work
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === (gBoard.length * gBoard[0].length) - gLevel.MINES ) {
        return true
    }
    return false
}


/////press buttons for level///////////////
function btnPress(level) {
    if (level === 1) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (level === 2) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (level === 3) {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    restart()
}


////////restart/////////////
function restart() {
    onInit()
    clearInterval(gIntervalTimerId);
    var elTimer = document.querySelector('.timer')
    elTimer.hidden = true

    
}


////smile//////////////////////
function renderIcon(isWin){
    var img = document.querySelector('.header img')
    img.src =  NORMAL 
    if(isWin === 'win'||isWin === 'lose'){
        img.src = isWin? WIN : LOSE
    }
    console.log('img:',img )
}

function iconClick(){
    restart()
}

//////////////// HINT////////////

function renderLightBulbs(){
    var lightBulbs = document.querySelector('.light-bulbs')
    lightBulbs.innerHTML = getStrForLight()
}

function getStrForLight(){
    var strHTML =''
    for(var i = 0 ; i< gGame.hints ; i++){
        strHTML += ` <img src="imges/bulb.png" alt="">`
    }
    return strHTML
}

function hint(){

}

function revealInt(){

}