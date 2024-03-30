/*
Setting up global variables 
*/
let gameTable = document.getElementById("game table"); 
let tableBody; 
//array of bomb coordinates in form "row, col"
let bombArray = []; 
let row; 
let col; 

//timer section elements 
let resetButton = document.getElementById("resetButton"); 
let timerImgs = document.getElementById("timerImgs").getElementsByTagName("img")
let bombCountImgs = document.getElementById("bombCountImgs").getElementsByTagName("img");

resetButton.onmouseup = reset; 
resetButton.onmousedown = function(){resetButton.src = "./assets/resetButtonClicked.png";}; 
resetButton.onmouseleave = function(){resetButton.src = "./assets/resetButton.png";}
resetButton.draggable = false; 

let interval; 
let firstClick; 
let secs = 1;  

//total amount of bombs on board, number of flagged tiles, and number of revealed tiles 
let ttlBombs; 
let flagCount = 0; 
let ttlRevealed = 0; 

//setup difficulty selection buttons
let selectedButton; 
const buttons = document.getElementsByTagName("button"); 
for(let i = 0; i < buttons.length; i++){
    buttons[i].onclick = function(){buttonHandler(buttons[i]);}
}
let buttonBackgroundColor = getComputedStyle(buttons[0]).getPropertyValue('background-color'); 
let buttonSelectColor = 'rgb(165, 156, 118)'; 

//click handler for mouse clicks on gameboard
gameTable.onmousedown = function(evt){clickHandler(evt);}
gameTable.onmouseup = function(evt){clickHandler(evt);}
//prevent context menu from popping up when flagging 
gameTable.oncontextmenu = function(evt){evt.preventDefault();} 

/*
Function to generate an array of randomly generated coordinates of bombs on board. 
The array bombArray contains coordinates of bombs as the string "row, col" 
@param bombs: number of bomb coordinates to generate
*/
function createBombArray(bombs){
    ttlBombs = bombs; 
    bombArray = []; 
    let i = 0; 
    while(i < bombs){
        let rowCoord = Math.floor(Math.random()*(row)); 
        let colCoord = Math.floor(Math.random()*(col)); 
        let coords = rowCoord +", " + colCoord; 

        if(coords in bombArray)
            continue; 

        bombArray.push(coords);
        let bombTile = document.getElementById(coords);
        //define a property called isBomb for all bomb tiles and set to true; 
        Object.defineProperty(bombTile, "isBomb", {value:true,writeable:false,});
        i++; 
    }

    updateBombCount(); 
}

/*
Function to create the HTML table. It sets <td> elements ID equal to 
their coordinates on the board as the string "row, col". This function is called
by the startGame function, and it uses the global variables row and col 
*/
function createTable(){

    tableBody = document.createElement('tbody'); 

    for(let i = 0; i < row; i++){
        const row = document.createElement('tr'); 

        for(let j = 0; j < col; j++){
            const cell = document.createElement('td'); 
            createCell(cell, i, j); 

            //append cell to row 
            row.appendChild(cell); 

        }
        tableBody.appendChild(row); 
    }
    gameTable.appendChild(tableBody); 

    document.getElementById("timerSection").style.width = col*26 +4 +"px";
   
}

/*
Helper function to make each cell of gameTable, called by createTable 
@param cell: cell DOM element <td> 
@param i: Row
@param j: column 
*/
function createCell(cell,i , j){
    const image = document.createElement('img');
    image.draggable = false;  
    image.src = "./assets/default.png"; 
    image.width = 24;
    image.height = 24; 
    cell.appendChild(image); 

    //make tile id its coordinates 
    let coords = i + ", " + j; 
    image.id = coords; 
    image.onmouseenter = function(evt){clickHandler(evt);}
    image.onmouseleave = function(evt){clickHandler(evt);}
}

/*
Difficulty selection button handler. Each button's onclick is assigned to this
function and passes themself in the parameter
@param button: button element passed in, each button passes in themselves 
 */
function buttonHandler(button){
    
    if(button != selectedButton && button.id != 'start'){
        button.style['background-color'] = buttonSelectColor; 

        if(selectedButton)
            selectedButton.style['background-color'] = buttonBackgroundColor; 

        selectedButton = button
        buttons[buttons.length-1].disabled = false; 
    }

    else if(button.id != "start"){
        selectedButton = undefined; 
        button.style['background-color'] = buttonBackgroundColor; 
        buttons[buttons.length-1].disabled = true; 
    }

    else {
        reset();  
    }   
}

/*
Function for handling mouse clicks on the gameTable:
evt.buttons == 1 when entering/leaving means user is holding left click 
evt.buttons == 2 when entering/leaving means user is holding right click

evt.button == 0 when mouse down means user left clicked that tile
evt.button == 0 when mouse up means user released left click on that tile

evt.button == 2 when mouse down means user right clicked that tile 
evt.button == 2 when mouse up means user released right click on that tile

@param evt: event object passed from mouseEvent 
*/
function clickHandler(evt){
    const tile = evt.srcElement;
    //user clicked on a tile, not on the edge of the table
    if(tile.tagName == "IMG" && tile.class != "revealed"){

        if(evt.type == "mousedown"){
            //on left click 
            if(evt.button == 0 && tile.class != "flagged"){
                tile.src = "./assets/defaultClicked.png"; 
            }
            //on right click update flag count  
            if(evt.button ==2){
                if(tile.class != "flagged"){
                    tile.src = "./assets/flagged.png"; 
                    tile.class = "flagged"; 
                    flagCount ++; 
                }
                else{
                    tile.src = "./assets/default.png"; 
                    tile.class = ""; 
                    flagCount--; 
                }
                updateBombCount();   
            }
        }
        //When releasing, only reveal if it was a left click 
        else if (evt.type == "mouseup"){
            resetButton.src = "./assets/resetButton.png"
            if(evt.button ==0 && tile.class != "flagged")
                reveal(tile); 
        }

        else if(evt.type == "mouseenter"){
            if(evt.buttons == 1)
                tile.src = "./assets/defaultClicked.png";
        }

        else if(evt.type == "mouseleave"){
            if(evt.buttons == 1)
                tile.src = "./assets/default.png"; 
        }

        //if holding click changed reset button icon 
        if(evt.buttons == 1)
            resetButton.src = "./assets/holdingClick.png"; 
    }
}

/*
Function for starting the game, used in buttonHandler once difficulty is selected and 
the start button is pushed
*/
function startGame(){
    flagCount = 0; 
    ttlRevealed = 0; 
    secs = 1;  
    for(let i = 0; i < timerImgs.length; i++){
        timerImgs[i].src = "./assets/digit0.png"; 
    }
    //make table clickable 
    gameTable.style.pointerEvents = 'auto'; 

    if(tableBody){
        gameTable.removeChild(tableBody);  
        tableBody = undefined; 
    }
    if(selectedButton){
        switch(selectedButton.id){
            case "easy": 
                row = 9; 
                col = 9; 
                createTable();
                createBombArray(10);  
                break; 
            
            case "medium": 
                row = 16; 
                col = 16; 
                createTable() 
                createBombArray(40); 
                break; 

            case "hard": 
                row = 16; 
                col = 30; 
                createTable(); 
                createBombArray(99); 
                break; 
            
        }
        document.getElementById("timerSection").style.display = "block"; 
    }   
    else 
        document.getElementById("timerSection").style.display = "none";
}

/*
Function for revealing tiles. This function is assigned to the leftclick of each 
<td> element in the gameTable.
@param tile: tile image stored in cell 
*/
function reveal(tile){ 
    if(ttlRevealed==0)
        firstClick = true; 

    //if bomb end game
    if(tile.isBomb){
        loseGame(tile); 
    }
    //else reveal tile 
    else {
        let adj = checkAdjacency(tile);
        if(adj != 0){
            tile.class = "revealed"; 
            tile.src = "./assets/adj"+adj+".png";
            ttlRevealed++;  
        }
        else{
            recursiveReveal(tile)
        }

        if(firstClick){
            timerImgs[2].src = "./assets/digit1.png"; 
            interval = setInterval(updateTimer, 1000); 
            firstClick = false; 
        }
    
        //if all tiles revealed end game 
        else if(ttlRevealed == (row*col)-ttlBombs){
            winGame();
        }
    }
}
/*
helper function to recursively reveal tiles, used when a tile adjacent to no bombs is clicked
*/
function recursiveReveal(tile){
    let coordArr = tile.id.split(",",2); 
    let tileRow = parseInt(coordArr[0]); 
    let tileCol = parseInt(coordArr[1]);

    tile.class = "revealed"; 
    tile.src = "./assets/defaultClicked.png"; 
    ttlRevealed++; 

    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <=1; j++){
            let coords = (tileRow+i) + ", " + (tileCol+j); 
            let adjTile = document.getElementById(coords);  

            if (adjTile != null && adjTile.class != "revealed"){
                let adj = checkAdjacency(adjTile);  
                if (adj == 0){
                    recursiveReveal(adjTile); 
                }
                else{
                    adjTile.src = "./assets/adj"+adj+".png"; 
                    adjTile.class = "revealed";
                    ttlRevealed++; 
                }
            }
        }
    }

}

/*
Helper function to check the number of bombs that a tile is adjacent to
*/
function checkAdjacency(tile){
    let coordArr = tile.id.split(",",2); 
    let tileRow = parseInt(coordArr[0]); 
    let tileCol = parseInt(coordArr[1]); 
    let adj = 0; 

    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <=1; j++){
            let coords = (tileRow+i) + ", " + (tileCol+j); 
            let adjTile = document.getElementById(coords); 
            
            if(adjTile != null && adjTile.isBomb)
                adj++; 
        }
    }

    return adj; 
}

/*
Function called when player loses game 
@param bombClicked: tile of bomb user clicked
*/
function loseGame(bombClicked){
    clearInterval(interval); 
    gameTable.style.pointerEvents = "none";
    bombClicked.src = "./assets/bombClicked.png"; 
    resetButton.src = "./assets/loseSmile.png";

    for(let i = 0; i < bombArray.length; i++){
        let bomb = document.getElementById(bombArray[i]); 
        if(bomb != bombClicked &&bomb.class != "flagged")
            bomb.src = "./assets/bomb.png"; 
    }
}

function winGame(){
    clearInterval(interval); 
    resetButton.src = "./assets/winSmile.png";
    gameTable.style.pointerEvents = "none";

    for(let i = 0; i < bombArray.length; i++){
        let bomb = document.getElementById(bombArray[i]); 
        bomb.src = "./assets/flagged.png"; 
    } 
    
}

/*
function used to update bomb counter on top left of the timer section. 
This function is called by click handler to update it any time user right clicks, also used by
CreateBombArray to set the counter to the number of bombs at start of game. 
    - The count represents #of bombs - #of flags, so you know how many bombs you have left to flag, 
      although the game does not end until you have revealed all tiles that are not bombs 
*/
function updateBombCount(){
    let bombCount = (ttlBombs-flagCount)
    let bombCountArr = (bombCount+"").split("");
    let hundred = "0"; 
    let ten = "0"; 
    let one = "0"; 

    if(bombCountArr.length == 3){
        hundred = bombCountArr[0]; 
        ten = bombCountArr[1]; 
        one = bombCountArr[2]; 
    }
    else if(bombCountArr.length == 2){
        if(bombCount < 0)
            hundred =""; 
        ten = bombCountArr[0]; 
        one = bombCountArr[1]; 
    }
    else
        one = bombCountArr[0]; 

    bombCountImgs[0].src = "./assets/digit"+hundred+".png"; 
    bombCountImgs[1].src = "./assets/digit"+ten+".png"; 
    bombCountImgs[2].src = "./assets/digit"+one+".png"; 
}

/*
Function to update timer on the right side of timer section. Function is called when player reveals first tile on board, and is called 
every second. Timer is ended when player wins game or when player loses game. Timer is reset to 0 with reset function.
*/
function updateTimer(){
    secs++; 

    if(secs < 1000){
        let secArr = (secs+"").split(""); 
        let h = "0"; 
        let t = "0"; 
        let o = "0"; 
        
        if(secArr.length == 3){
            h = secArr[0]; 
            t = secArr[1]; 
            o = secArr[2]; 
        }
        else if(secArr.length == 2){
            t = secArr[0]; 
            o = secArr[1]; 
        }
        else
            o = secArr[0]; 

        timerImgs[0].src = "./assets/digit"+h+".png"; 
        timerImgs[1].src = "./assets/digit"+t+".png"; 
        timerImgs[2].src = "./assets/digit"+o+".png"; 
    }
}

/*
reset game, set to reset button 
*/
function reset(){
    clearInterval(interval); 
    resetButton.src = "./assets/resetButton.png"; 
    startGame(); 
}
