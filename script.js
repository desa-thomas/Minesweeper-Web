/*
Setting up global variables 
*/
let gameTable = document.getElementById("game table"); 
let tableBody; 
let bombArray = []; 
let row; 
let col; 

//setup difficulty selection buttons
let selectedButton; 
const buttons = document.getElementsByTagName("button"); 
for(let i = 0; i < buttons.length; i++){
    buttons[i].onclick = function(){buttonHandler(buttons[i]);}
}
let buttonBackgroundColor = getComputedStyle(buttons[0]).getPropertyValue('background-color'); 
let buttonSelectColor = 'rgb(165, 156, 118)'; 

/*
Function to generate an array of randomly generated coordinates of bombs on board 
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
Function to create the HTML table. It gives all <td> elements and ID equal to 
their coordinates on the board. 
@param row: The amount of rows to create 
@param col: The amount of columns to create 
*/
function createTable(){

    tableBody = document.createElement('tbody'); 

    for(let i = 0; i < row; i++){
        const row = document.createElement('tr'); 

        for(let j = 0; j < col; j++){
            const cell = document.createElement('td'); 
            
            //put default tile image 
            const image = document.createElement('img'); 
            image.src = "/assets/default.png"; 
            image.width = 24;
            image.height = 24; 
            cell.appendChild(image); 

            //make tile id its coordinates 
            cell.id = i +", "+ j; 

            //set up left and right click on each cell
            cell.oncontextmenu = function (){}
            cell.onclick = function(){}

            //append cell to row 
            row.appendChild(cell); 

        }
        tableBody.appendChild(row); 
    }

    gameTable.appendChild(tableBody); 
    
}

/*
Handler function to use the buttons like selection buttons
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

function startGame(){
    if(tableBody){
        gameTable.removeChild(tableBody); 
        tableBody = undefined; 
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
    
}