'use strict'



function startTimer(){
    timer += 0.001
    
    var elTimer = document.querySelector('.timer')
    elTimer.hidden = false
    elTimer.innerText = timer
    
}

