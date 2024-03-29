/*
Setting up global variables 

TO DO: 
Make first click safe 
Make timer and bomb count 
set winning conditions 

*/
let gameTable = document.getElementById("game table"); 
let tableBody; 
let bombArray = []; 
let row; 
let col; 
let ttlBombs; 
let bombCount; 

//timer section elements 
let resetButton = document.getElementById("resetButton"); 
let timerImgs = document.getElementById("timerImgs").getElementsByTagName("img")
let bombCountImgs = document.getElementById("bombCountImgs").getElementsByTagName("img");

resetButton.onmouseup = reset; 
resetButton.onmousedown = function(){resetButton.src = "./assets/resetButtonClicked.png";}; 
resetButton.onmouseleave = function(){resetButton.src = "./assets/resetButton.png";}
resetButton.draggable = false; 

let hours; 
let mins; 
let secs;  

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

/*
Function to generate an array of randomly generated coordinates of bombs on board. 
The array bombArray contains coordinates of bombs as the string "row, col" 
@param bombs: number of bomb coordinates to generate
*/
function createBombArray(bombs){
    ttlBombs = bombs; 
    let i = 0; 
    while(i < bombs){
        let rowCoord = Math.floor(Math.random()*(row)); 
        let colCoord = Math.floor(Math.random()*(col)); 
        let coords = rowCoord +", " + colCoord; 

        if(coords in bombArray)
            continue; 

        bombArray.push(coords);
        let bombTile = document.getElementById(coords); 
        Object.defineProperty(bombTile, "isBomb", {value:true,writeable:false,});

        //define a property called isBomb for all bomb tiles and set to true; 
        i++; 
    }

    console.log(bombArray); 
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

    else{
        startGame(); 
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
            //on right click 
            if(evt.button ==2){
                if(tile.class != "flagged"){
                    tile.src = "./assets/flagged.png"; 
                    tile.class = "flagged"; 
                }
                else{
                    tile.src = "./assets/default.png"; 
                    tile.class = ""; 
                }  
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
    //make table clickable 
    gameTable.style.pointerEvents = 'auto'; 

    if(tableBody){
        gameTable.removeChild(tableBody);  
        tableBody = undefined; 
        header = undefined; 
    }

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
        
        case "custom": 
            console.log("custom"); 
            break; 
    }
    
    document.getElementById("timerSection").style.display = "block"; 
}

/*
*/
function startTimer(){}
/*
Function for revealing tiles. This function is assigned to the leftclick of each 
<td> element in the gameTable.
@param tile: tile image stored in cell 
*/
function reveal(tile){
    // console.log("disabled table"); 
    // gameTable.style.pointerEvents = 'none'; 
     console.log(tile.id); 

     if(tile.isBomb){
        tile.src = "./assets/bombClicked.png"; 
        endGame(tile); 
     }

    else{
        let adj = checkAdjacency(tile);
        if(adj != 0){
            tile.class = "revealed"; 
            tile.src = "./assets/adj"+adj+".png"; 
        }
        else{
            recursiveReveal(tile)
        }
    }
}

function recursiveReveal(tile){
    let coordArr = tile.id.split(",",2); 
    let tileRow = parseInt(coordArr[0]); 
    let tileCol = parseInt(coordArr[1]); 
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <=1; j++){
            let coords = (tileRow+i) + ", " + (tileCol+j); 
            let adjTile = document.getElementById(coords);  

            if (adjTile != null && adjTile.class != "revealed"){
                let adj = checkAdjacency(tile); 
                tile.class = "revealed"; 

                if (adj == 0){
                    tile.src = "./assets/defaultClicked.png"; 
                    recursiveReveal(adjTile); 
                }
                else{
                    tile.src = "./assets/adj"+adj+".png"; 
                }
            }
        }
    }

}

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

function endGame(bombClicked){
    gameTable.style.pointerEvents = "none";
    resetButton.src = "./assets/loseSmile.png"; 

    for(let i = 0; i < bombArray.length; i++){
        let bomb = document.getElementById(bombArray[i]); 
        if(bomb != bombClicked)
            bomb.src = "./assets/bomb.png"; 
    }
}
/*
reset game, set to reset button 
*/
function reset(){
    resetButton.src = "./assets/resetButton.png"; 
    startGame(); 
}
