'use strict'


function createBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 4, 
                isShown: false, 
                isMine: false, 
                isMarked: false
            }
        }
    }
    
    createMines(board,gLevel.MINES)

  
    


    return board
}



//* GETS A BOARD FROM CREATEBOARD AND RENDERING IT TO THE DOM
//renders only tr so need to come inside a table with class board

function renderBoard(board, selector) {
    
    var strHTML = '<table border="1" cellpadding="10"><tbody class="board">'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            //negs loop
            var negsMinesCountAround = setMinesNegsCount(gBoard,i,j)
            negsMinesCountAround = (negsMinesCountAround === 0 ) ? ' ' : negsMinesCountAround

            
            const cell = board[i][j]            
            cell.minesAroundCount = negsMinesCountAround
            
            var cellValue = ' '
            if(cell.isShown && !cell.isMine && !cell.isMarked){
                cellValue = negsMinesCountAround
            }
            else if(cell.isShown && cell.isMine){
                cellValue = MINE
            }
            else if(!cell.isShown&& cell.isMarked){
                cellValue = FLAG
            }

            const className = `cell cell-${i}-${j}  ${(cell.isShown)? ' cell-revealed' : '' }` 

            strHTML += `<td oncontextmenu="rightClick(event,${i},${j});return false;" onclick="cellClicked(event,${i},${j})" class="${className}">
            ${cellValue}
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}




function createMines(board,amountOfMines){
    for(var i =0 ; i < amountOfMines;  i++){
        board[ getRandomInt(0, board.length)][getRandomInt(0, board[0].length)].isMine = true

    }
    
}


//* NEIGHBORS LOOP
function setMinesNegsCount(board, rowIdx, colIdx) {
    var countAround = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if(!board[i][j].isMine)continue   
            countAround++
            

        }
    }
    return countAround
}



//* NEIGHBORS LOOP ARRAY
function NegsAround(board, rowIdx, colIdx) {
    var cellsAround = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if(board[i][j].isMine)continue   
            var cell = {i:i,j:j}
            cellsAround.push(cell)
            

        }
    }
    return cellsAround
}



//* NEIGHBORS LOOP ARRAY PRESS ON NUMBER
function NegsAroundPessNum(board, rowIdx, colIdx) {
    var cellsAround = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var cell = {i:i,j:j}
            cellsAround.push(cell)
            

        }
    }
    return cellsAround
}




//* RENDER ONLY CELL TO DOM
// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


// // get render html
// function getStrHTML(cell) {
//     console.log('cell:',cell.minesAroundCount )
//     return `<span>${cell.minesAroundCount}</span>`
// }



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


// ///disable right click
// function disRightclick(){
//     const elTest = document.querySelector('.test')
//     console.log('elTest:', elTest)
//     elTest.addEventListener('contextmenu', (event) => {
//         console.log('event:', event)
//     });

// }

