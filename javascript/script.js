let tetrisTable = []; // 10 széles, 20 magas tömb

class Table {
    constructor() {
        
    }
    
    init() {
        //feltölti 0 értékekkel a kétdimenziós tömböt
        tetrisTable = [];
        let html = '<img src="img/default.png">';
        let element = document.getElementById('tab0');
        let ID = 0;
 
         
        element.textContent = '';
        
        for(let i = 0; i < 20; i++) {
            tetrisTable.push([]);
            for(let j = 0; j < 10; j++) {
                tetrisTable[i].push(0);
                element.insertAdjacentHTML('beforeend', '<img src="img/default.png", id = '+ [i,j]+' >');
                ID++;
            }
            element.insertAdjacentHTML('beforeend', '<br>');
        }
    }
    checkFullLine() {
        let fullIndex = [];
        for(let i = 0; i < 20; i++) {
            const someIsNotOne = tetrisTable[i].some(item => item !== 1);
            const isAllOne = !someIsNotOne; // <= this is your result
            
            if(isAllOne) {
                fullIndex.push(i);

            }
            
        }
        return fullIndex;
    }
    
    clearLines(ind) {
        function moveDown(start) {
            let until = ind[0];
            
            for(let i = start -1; i >= 0 ; i--) {
                for(let j = 0; j < tetrisTable[i].length; j++){
                    if(tetrisTable[i][j] === 1) {
                        tetrisTable[i][j] = 0;
                        tetrisTable[i+1][j] = 1;
                    }
                }
            }
            allElements[elementType].clearSound.play();
            table.displayTable();
            
        }
        
        
        
        ind.forEach(cur => {
            for(let i = 0; i < tetrisTable[cur].length; i++) {
                tetrisTable[cur][i] = 0;
            }

            moveDown(cur);
        });
            

        //this.displayTable();    
        
        
    }
    
    newRandomElement(allobj) {
        let fullIndexes = this.checkFullLine();
        fullIndexes.sort();
        this.clearLines(fullIndexes);
        
        let rand = Math.floor(Math.random() * 2);
        allobj[rand].downSound.play();
        allobj[rand].init();
        elementType = rand;
        
    }
    
    displayTable() {
        let html = '<img src="img/default.png">';
        
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 10; j++) {
                let element = document.getElementById([i,j]);
                if(tetrisTable[i][j] === 0) {
                    element.src = 'img/default.png';
                } else {
                    element.src = 'img/element.png';
                }
                
            }
        }

    }
}

class Element {
    // position: 0 = top, 1 = right, 2 = left, 3 = down
    constructor() {
        this.i = 0;
        this.j = 3;
        this.position = 0;
        //this.posItem = ['top', 'right','left','down'];
        this.timer = 300;
        this.rotateSound = new sound("audio/rotate.ogg", false, 1);
        this.downSound = new sound("audio/fall.ogg", false, 1);
        this.clearSound = new sound("audio/clear.ogg", false, 1);
        this.moveSound = new sound("audio/move.wav", false, 0.2);
    }
    
    initElement() {
        this.i = 0;
        this.j = 3;
        this.position = 0;

;
    }    
}

class LineElement extends Element {
    constructor(i,j,position) {
        super(i,j,position);
        this.posItem = ['top','left'];
        
    }
    
    init() {
        this.initElement();
        tetrisTable[this.i][this.j] = 1;
        tetrisTable[this.i+1][this.j] = 1;
        tetrisTable[this.i+2][this.j] = 1;
        tetrisTable[this.i+3][this.j] = 1;
        this.repInterval = setInterval( () => {
            line.moveDown();
            table.displayTable();
            
            } , this.timer);
    }
    
    checkDown() {
        switch(this.position) {
            case 0: 
                return tetrisTable[this.i + 4 ][this.j] === 1;
            case 1: 
                return tetrisTable[this.i + 1 ][this.j] === 1 ||
                    tetrisTable[this.i + 1 ][this.j+1] === 1  ||
                    tetrisTable[this.i + 1 ][this.j+2] === 1  ||
                    tetrisTable[this.i + 1 ][this.j+3] === 1;
                
        }    
        
    }
    
    moveDown() {
        if(this.posItem[this.position] === 'top') {
            // függõleges elemet lejebb viszi a tömbbe 1-el.
            if( this.i >= 19-3 || this.checkDown()) {
                clearInterval(this.repInterval);
                 
                if(tetrisTable[0][this.j] === 1) alert('END');
                    table.newRandomElement(allElements);
                
                return;
            }
              
            tetrisTable[this.i][this.j] = 0;
            tetrisTable[this.i+1][this.j] = 1;
            tetrisTable[this.i+2][this.j] = 1;
            tetrisTable[this.i+3][this.j] = 1;
            tetrisTable[this.i+4][this.j] = 1;


        }else if(this.posItem[this.position] === 'left') {
            if( this.i >= 19 || this.checkDown() ) {
               
                clearInterval(this.repInterval);
                if(tetrisTable[0][this.j] === 1) 
                    alert('END');
                table.newRandomElement(allElements);
                
                
                return;
            }
            tetrisTable[this.i][this.j] = 0;
            tetrisTable[this.i][this.j+1] = 0;
            tetrisTable[this.i][this.j+2] = 0;
            tetrisTable[this.i][this.j+3] = 0;
            // 1 sorral lejebb viszi a vizszintes elemet
            tetrisTable[this.i+1][this.j] = 1;
            tetrisTable[this.i+1][this.j+1] = 1;
            tetrisTable[this.i+1][this.j+2] = 1;
            tetrisTable[this.i+1][this.j+3] = 1;
                
        }
        
        
        this.i += 1;
        

    }
    moveRight() {
        //Ha az elem fuggolegesen all és csak ha a palyan belül van
        if(this.posItem[this.position] === 'top' && this.j <= 8) {
            if(tetrisTable[this.i][this.j+1] == 1 || tetrisTable[this.i+1][this.j+1] == 1 ||
             tetrisTable[this.i+2][this.j+1] == 1 || tetrisTable[this.i+3][this.j+1] == 1 )
                return;
            tetrisTable[this.i][this.j] = 0;
            tetrisTable[this.i+1][this.j] = 0;
            tetrisTable[this.i+2][this.j] = 0;
            tetrisTable[this.i+3][this.j] = 0;
            // minden helyet a line elementnek jobbra tolja egyel
            tetrisTable[this.i][this.j+1] = 1;
            tetrisTable[this.i+1][this.j+1] = 1;
            tetrisTable[this.i+2][this.j+1] = 1; 
            tetrisTable[this.i+3][this.j+1] = 1;
            this.j +=1;
            
        } else if(this.posItem[this.position] === 'left' && this.j < 8-2) {
            if(tetrisTable[this.i][this.j+4] == 1 )
                return;
            
            tetrisTable[this.i][this.j] = 0;
            // elmozgatja a vonal elemet jobbra ha vizszintes allasba van
            tetrisTable[this.i][this.j+1] = 1;
            tetrisTable[this.i][this.j+2] = 1; 
            tetrisTable[this.i][this.j+3] = 1;
            tetrisTable[this.i][this.j+4] = 1;
            this.j +=1;
            
        }
        
        
        
    }
    moveLeft() {
        //Ha az elem fuggolegesen all és csak ha a palyan belül van
        if(this.posItem[this.position] === 'top' && this.j > 0) {
            if(tetrisTable[this.i][this.j-1] == 1 || tetrisTable[this.i+1][this.j-1] == 1 ||
            tetrisTable[this.i+2][this.j-1] == 1 || tetrisTable[this.i+3][this.j-1] == 1 )
                return;
            tetrisTable[this.i][this.j] = 0;
            tetrisTable[this.i+1][this.j] = 0;
            tetrisTable[this.i+2][this.j] = 0;
            tetrisTable[this.i+3][this.j] = 0;
            // minden helyet a line elementnek jobbra tolja egyel
            tetrisTable[this.i][this.j-1] = 1;
            tetrisTable[this.i+1][this.j-1] = 1;
            tetrisTable[this.i+2][this.j-1] = 1; 
            tetrisTable[this.i+3][this.j-1] = 1;
            this.j -=1;
            
        } else if(this.posItem[this.position] === 'left' && this.j > 0) {
            if(tetrisTable[this.i][this.j-1] == 1 )
                return;
            tetrisTable[this.i][this.j+3] = 0;
            tetrisTable[this.i][this.j-1] = 1;
            this.j -=1;
            
        }
        
        
        
    }
    
    
    turnLeft() {
            // alulról kitörli az elemet, felkésziti a forgatásra
            // csak akkor forgatja el ha forgatás után nem megy ki a palyarol
            if(this.j <= 8-2) {
                tetrisTable[this.i][this.j] = 1;
                tetrisTable[this.i+1][this.j] = 0;
                tetrisTable[this.i+2][this.j] = 0;
                tetrisTable[this.i+3][this.j] = 0;
                tetrisTable[this.i+4][this.j] = 0;
                // jobb oldalra feltölti 1-esekkel a tömböt
                tetrisTable[this.i][this.j+1] = 1;
                tetrisTable[this.i][this.j+2] = 1;
                tetrisTable[this.i][this.j+3] = 1;
                this.position = 1; // átváltja a csík helyzetét forgatásra
            //table.displayTable(); // frissiti az UI-t
            }
    }
    
    turnBack() {
            tetrisTable[this.i][this.j+1] = 0;
            tetrisTable[this.i][this.j+2] = 0;
            tetrisTable[this.i][this.j+3] = 0;
        
            tetrisTable[this.i+1][this.j] = 1;
            tetrisTable[this.i+2][this.j] = 1;
            tetrisTable[this.i+3][this.j] = 1;
            //table.displayTable();
            this.position = 0;
    }
    
}

class SquareElement extends Element {
    constructor(i,j,position) {
        super(i,j,position);
    }
    
    init() {
        this.initElement();
        tetrisTable[this.i][this.j] = 1;
        tetrisTable[this.i+1][this.j] = 1;
        tetrisTable[this.i][this.j+1] = 1;
        tetrisTable[this.i+1][this.j+1] = 1;
        
        this.repInterval = setInterval( () => {
            this.moveDown();
            table.displayTable();
            
            } , this.timer);
    }
    
    moveDown() {
        if( this.i >= 18 || tetrisTable[this.i +2][this.j] === 1 || 
           tetrisTable[this.i+2][this.j +1] === 1 ) {
            
            clearInterval(this.repInterval);
            if(tetrisTable[0][this.j] === 1) alert('END');
                table.newRandomElement(allElements);
                
            return;
         }
                
        tetrisTable[this.i][this.j] = 0;
        tetrisTable[this.i][this.j+1] = 0;
        
        tetrisTable[this.i+2][this.j] = 1;
        tetrisTable[this.i+2][this.j+1] = 1;
        this.i ++;

    }
    moveRight() {
        if( this.j <= 7 ) {
            if(tetrisTable[this.i][this.j+2] == 1 || tetrisTable[this.i+1][this.j+2] == 1)
                return;
            
            tetrisTable[this.i][this.j] = 0;
            tetrisTable[this.i+1][this.j] = 0;
            
            tetrisTable[this.i][this.j+2] = 1;
            tetrisTable[this.i+1][this.j+2] = 1;
            this.j +=1;
        
        }
    }
    moveLeft() {
        if(this.j > 0) {
            if(tetrisTable[this.i][this.j-1] == 1 || tetrisTable[this.i+1][this.j-1] == 1)
                return;
            tetrisTable[this.i][this.j+1] = 0;
            tetrisTable[this.i+1][this.j+1] = 0;
            
            tetrisTable[this.i][this.j-1] = 1;
            tetrisTable[this.i+1][this.j-1] = 1;
            
            this.j -=1;
            
        }
    }
    
}

function sound(src, loop, volume) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.volume = volume;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  if(loop)
      this.sound.setAttribute("loop", "true");
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

let elementType, table, line, allElements;
elementType = Math.floor(Math.random() * 2); // 0 = line, 1 = square
table = new Table();


line = new LineElement();
square = new SquareElement();
allElements = [line,square];

table.init();
allElements[elementType].init();

//sounds
let backgorundMusic = new sound("audio/background.ogg", true, 0.1);



function logKey(e, click){    

    switch(elementType) {
        case 0: 
            if (e.keyCode === 32 || click === "rot") {
                if(line.position === 0) {
                    line.turnLeft();
                }
                    
                else if(line.position === 1)
                    line.turnBack();
                line.rotateSound.play();
                table.displayTable();
            }
            else if(e.keyCode === 39 || click === "right") {
                line.moveRight();
                line.moveSound.play(); 
                table.displayTable();
                
            }
            else if(e.keyCode === 37 || click === "left") {
                line.moveSound.play(); 
                line.moveLeft();
                table.displayTable();
            }
            
            else if(e.keyCode === 40) {
                line.moveDown();
                table.displayTable();
            }break;
            
        case 1 :
            if(e.keyCode === 39 || click === "right") {
                square.moveRight();
                line.moveSound.play(); 
                table.displayTable();
            }
            else if(e.keyCode === 37 || click === "left") {
                square.moveLeft();
                line.moveSound.play(); 
                table.displayTable();
            }
            else if(e.keyCode === 40) {
                square.moveDown();
                line.moveSound.play(); 
                table.displayTable();
            }break;
    }
    
}

//document.addEventListener('keypress', logKey);
document.addEventListener('keydown', logKey);
document.getElementById("btn-rotate").addEventListener('click', () => {
    logKey(Event,"rot");
});

document.getElementById("btn-right").addEventListener('click', () => {
    logKey(Event,"right");
});

document.getElementById("btn-left").addEventListener('click', () => {
    logKey(Event,"left");
});
document.getElementById('btn-stop').addEventListener('click', () => {
     clearInterval(allElements[elementType].repInterval);
    backgorundMusic.stop();
    table.init();
    document.getElementById('btn-stop').blur();

});

document.getElementById('btn-new').addEventListener('click', () => {
    location.reload();
    document.getElementById('btn-new').focus();
});
document.getElementById('btn-sound').addEventListener('change', () => {
    let check = document.getElementById('btn-sound');
    
    if(check.checked)
        backgorundMusic.play();
    else {
        backgorundMusic.stop();
    }
    check.blur();    
    
});


