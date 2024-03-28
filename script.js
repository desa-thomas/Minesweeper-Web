/*
Setting up global variables 

TO DO: 
finish making tile clicks smooth
*/
let gameTable = document.getElementById("game table"); 
let headTable = document.getElementById("head table"); 
let tableBody; 
let bombArray = []; 
let row; 
let col; 

//game header elements 
let resetButton = document.getElementById("resetButton"); 
let timerImgs = []; 
let bombCountImgs = []; 
resetButton.onmouseup = reset; 
resetButton.onmousedown = function(){resetButton.src = "./assets/resetButtonClicked.png"}; 


//setup difficulty selection buttons
let selectedButton; 
const buttons = document.getElementsByTagName("button"); 
for(let i = 0; i < buttons.length; i++){
    buttons[i].onclick = function(){buttonHandler(buttons[i]);}
}
let buttonBackgroundColor = getComputedStyle(buttons[0]).getPropertyValue('background-color'); 
let buttonSelectColor = 'rgb(165, 156, 118)'; 

//mouse listener reveal if left click, flag for anything else 
let leftclick = 0; 
let rightclick = 0;
document.body.onmousedown = function (evt){
    evt.button == 0 ? ++leftclick : ++rightclick}

document.body.onmouseup = function (evt){
    evt.button == 0 ? --leftclick : --rightclick}

/*
Function to generate an array of randomly generated coordinates of bombs on board. 
The array bombArray contains coordinates of bombs as the string "row, col" 
@param bombs: number of bomb coordinates to generate
*/
function createBombArray(bombs){

    let i = 0; 
    while(i < bombs){
        let rowCoord = Math.floor(Math.random()*(row)); 
        let colCoord = Math.floor(Math.random()*(col)); 
        let coords = rowCoord +", " + colCoord; 

        if(coords in bombArray)
            continue; 

        bombArray.push(coords); 
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

    //clicking animation
    cell.onmouseenter = function(){
        if(leftclick)
            image.src = "../assets/defaultClicked.png"; }
    
    cell.onmousedown = function(){
        if(rightclick ==0 )
            image.src = "../assets/defaultClicked.png"; 
    }
    cell.onmouseleave = function(){
        if(leftclick){
            image.src = "./assets/default.png";}}

    //left click reveal right click flag
    cell.onmouseup = function(){reveal(image);}

    cell.oncontextmenu = function(){flag(image);}
}

/*
Handler function to use the buttons like selection buttons. Each button's onclick is assigned to this
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
reset game, set to reset button 
*/
function reset(){
    resetButton.src = "./assets/resetButton.png"; 
    console.log("reset"); 
}

/*
function for flagging tiles. This function is assigned to the rightclick of 
each <td> in the gameTable. 
@param tile: tile image stored in cell 
*/
function flag(tile){
    // console.log("enabled table");
    // gameTable.style.pointerEvents = 'auto';  

    if (tile.class == "flagged"){
        tile.src = "./assets/default.png"; 
        tile.class = undefined; 
    }
    
    else{
        tile.class = "flagged"; 
        tile.src = "./assets/flagged.png"; 
    }
}

/*
Function for revealing tiles. This function is assigned to the leftclick of each 
<td> element in the gameTable.
@param tile: tile image stored in cell 
*/
function reveal(tile){
    // console.log("disabled table"); 
    // gameTable.style.pointerEvents = 'none'; 
     console.log(tile.id); 
}

