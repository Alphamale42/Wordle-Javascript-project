let dictionary = {};
let state = {};
let word = '';
let counter = 0;
let hint = '';
let counter2 = 0;
let globalbool = 0;

// Above loads-in dictionary from API.
const getDict = async() => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    }});
    let json = await res.json();
    dictionary = json["dictionary"];
    rand = dictionary[Math.floor(Math.random() * dictionary.length)];
    word = rand['word'].toLowerCase();
    hint = rand['hint'];
    console.log(word);
    state = {
        secret: word,
        grid: Array(4)
            .fill()
            .map(() => Array(4).fill('')),
        currentRow: 0,
        currentCol: 0,
    }
} 

document.getElementById('buttone').onclick = function() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    document.classList('box').innerHTML = "color:white;";
    let blurout1 = document.getElementById('buttone');
    blurout1.blur();
    return;
}

document.getElementById('butttwo').onclick = function() {
    counter2++;
    var spanel = document.getElementById("bottomhint");
    spanel.classList.toggle("open");
    if(counter2 % 2 != 0) {
        spanel.innerText = "Hint: " + hint;
        let tempel = document.getElementById('bottbar');
        tempel.style.marginTop = '10px';
        document.getElementById('bottbar').innerHTML = style;
    }
    else{
        spanel.innerText = '';
        let tempel = document.getElementById('bottbar');
        tempel.style.marginTop = '100px';
        document.getElementById('bottbar').innerHTML = style;
    }
}

document.getElementById('buttthree').onclick = function() {
    
    if(document.getElementById('buttthree').onclick){
        counter++;
        if(counter % 2 == 0){
            document.getElementById("information").innerHTML = '';
            let move = document.getElementById('button2');
            move.style = "position:relative; left: 15px;"
            document.getElementById('button2').innerHTML = style;

        } else{
            document.getElementById("information").innerHTML = "<h2>&emsp;How to Play</h2>"
    + "<ul><li>You have 4 tries</li><li>A correct letter turns green</li>"
    + "<li>A correct letter in the wrong place turns yellow</li><li>An incorrect letter turns gray</li>"
    + "<li>Letters can be used more than once</li><li>You can get a hint by clicking the ? icon</li>"
    + "<li>Type guesses with the keyboard</li><li>Guesses are submitted with Enter/Return</li></ul>";
            let move = document.getElementById('button2');
            move.style = "position:relative; right: 150px;"
            document.getElementById('button2').innerHTML = style;
        }
        let blurout = document.getElementById("buttthree");
        blurout.blur();
        return;
    } 
}


document.getElementById('button2').onclick = function() { 
    if(globalbool==1){
        globalbool = 0;
        document.getElementById("myimage").innerHTML = '';
        
        startup();
    }
    for(let i = 0; i < state.grid.length; i++){
        for(let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = '';
            if(box.classList.contains("right")){
                box.classList.remove("right");
            }
            if(box.classList.contains("wrong")){
                box.classList.remove("wrong");
            }
            if(box.classList.contains("empty")){
                box.classList.remove("empty");
            }
            state.grid[i][j] = '';
        }
    } 
    console.log("starting over...");
    state.currentCol = 0;
    state.currentRow = 0;
    async function resetqueue() {
        await getDict();
    }
    resetqueue();
    let restart = document.getElementById("button2");
    restart.blur();
    return;
};

function updateGrid(){
    for(let i = 0; i < state.grid.length; i++){
        for(let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}


function drawBox(container, row, col, letter=''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;

}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for(let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function registerKeyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if(key==='Enter'){
            if(state.currentCol===4){
                const word = getCurrentWord();
                if(word){
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else{
                    alert('Not a valid word');
                }
            }
            if(state.currentCol===3) {
                alert("You must complete this word first");
            }
        }
        if(key==='Backspace'){
            
            removeLetter();
        }
        if(isLetter(key)){
            
            addLetter(key);
        }
        updateGrid();
    };
}

function getCurrentWord(){
    return state.grid[state.currentRow].reduce((prev,curr) => prev+curr);
}

function isWordValid(word){
    return dictionary.includes(word);
}

function revealWord(guess){
    const row = state.currentRow;
    for(let i = 0; i < 4; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if(letter===state.secret[i]){
            box.classList.add('right');
        } else if (state.secret.includes(letter)){
            box.classList.add('wrong');
        } else{
            box.classList.add('empty');
        }
    }
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 4;
    if(isWinner){
        alert('Congratulations!');
        document.getElementById('game').innerHTML = '';
        var img = document.createElement("img");
        img.src = "https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif";
        var src = document.getElementById("myimage");
        src.appendChild(img);
        globalbool = 1;

    } else if(isGameOver) {
        alert('best luck in future');
        
    }
}

function isLetter(key){
    return key.length === 1 && key.match(/[a-z || A-Z]/);
}
function includes(letter){
    
}
function addLetterDisplay(letter) {
    state.boxbottom[0][0] = letter;
    return;
}

function addLetter(letter) {
    if(state.currentCol === 4) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter(){
    if(state.currentCol===0) return;
    state.grid[state.currentRow][state.currentCol-1] = '';
    state.currentCol--;

}

async function startup(){
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
    await getDict()
    console.log(state.secret);
}
startup();
