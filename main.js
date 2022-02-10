/* Starting code */
const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
/*----*/

//constructor of Field class
class Field {
  constructor(board) {
    this.board = board;
    this.lengthY = this.board.length;
    this.lengthX = this.board[0].length;
    //Sets player's in random position on the board
    this.startX = Math.floor(Math.random() * this.lengthX);
    this.startY = Math.floor(Math.random() * this.lengthY);
    this.board[this.startY][this.startX] = pathCharacter;
  }

  //Prints board into the terminal without square brackets, quotation marks and colons
  print() {
    let str = [];
    const strBoard = () => {
      for (let i = 0; i < this.board.length; i++) {
        str.push(this.board[i].join(""));
        console.log(str[i]);
      }
    };
    strBoard();
  }

  //Changes position on the board
  changePosition(move){
    switch (move) {
        case "u":
          this.startY--;
          break;
        case "d":
          this.startY++;
          break;
        case "l":
          this.startX--;
          break;
        case "r":
          this.startX++;
          break;
      }
  }

  //generates random board with three parameters: width, height and percentage of holes
  static generateField(lenX, lenY, holes){
    let randomField = [];
    const polesNum = lenX * lenY; //board area
    const holesNum = Math.round(polesNum * holes/100); //number of holes
    let elements = []; //creates the array with the required numbers of holes and field characters to cover the whole board 
    for (let i = 1; i <= polesNum; i++){
      if (i <= holesNum){
        elements.push(hole);
      } else {
        elements.push(fieldCharacter);
      }}
    
    //pollutes the board with random character from 'elements' array
    for (let i = 0; i < lenY; i++){
        let verse = [];
        for (let j = 0; j < lenX; j++){
            let randomIndex = Math.floor(Math.random() * elements.length);
            verse.push(elements.splice(randomIndex, 1).toString());
          }
        randomField.push(verse);
      }

    //generates random coordinates for hat position
    let randomX = Math.floor(Math.random() * lenX);
    let randomY = Math.floor(Math.random() * lenY);
    //puts the hat on the board if the chosen position isn't occupied by path character 
    while(randomX === this.startX || randomY === this.startY){
        let randomX = Math.floor(Math.random() * lenX);
        let randomY = Math.floor(Math.random() * lenY);
    }
    randomField[randomY][randomX] = hat;

    return randomField;
  }

  //returns true if the board can be solved
  solver(){
    let visitedArray = []; //creates the board witch provides ifnromation if current position was visited before

    for (let i = 0; i < this.lengthY; i++){
      let visitedVerse =[];
      for (let j = 0; j < this.lengthY; j++){
        visitedVerse.push(false);
      }
      visitedArray.push(visitedVerse);
    }

    let testArr = [[{x: this.startX, y: this.startY}]]; // creates the nested array with directions possible to move
    let i = 0; //the iterator for recursive function

    //checks if test direction is within baord bounries
    const isBound = (x, y) => {
      return x > -1 && y > -1 && x < this.lengthX && y < this.lengthY;
    }

    //checks if direciton is free to move and isn't visited before
    const isFree = (x, y) => {
      return this.board[y][x] === '░' && visitedArray[y][x] === false;
    }

    //main test function
    const test = () => {
      let movePossible = false;
      let testVerse = [];//the testArray's subarray
      let isWin = false;
      
      
      const checkDirection = (dx, dy) => {
        if (isBound(dx, dy)){ 
          if (this.board[dy][dx] === '^') {//checks if the following move leads to find the hat
            isWin = true;
        } else if (isFree(dx, dy)){//checks if the following move is possible
          testVerse.push({x: dx, y: dy});//pushes coordinates into subarray
          movePossible = true;
        }}}

      for (let j = 0; j < testArr[i].length; j++){//iterate through the subarray
          //checks 4 directions
          checkDirection(testArr[i][j].x + 1, testArr[i][j].y);
          checkDirection(testArr[i][j].x - 1, testArr[i][j].y);
          checkDirection(testArr[i][j].x, testArr[i][j].y + 1);
          checkDirection(testArr[i][j].x, testArr[i][j].y - 1);
          
            if (isWin){
              return isWin;
            } if (j === testArr[i].length - 1 && !movePossible){
              return movePossible;
            } else {
              visitedArray[testArr[i][j].y][testArr[i][j].x] = true;
            }

      }
        
            testArr.push(testVerse);
            i++;
            test(); //runs test again if the solution isn't found or further moves are still possible
          
    }
    test();
    return test();
    
  }

  //runs the game
  play(){
    this.print();
    console.log('Is it possible to solve? : ' + this.solver());

    console.log("Choose your direction: (u)p, (d)own, (l)eft, (r)ight");
    const plMove = prompt("Your choice: ");
    this.changePosition(plMove);
    if (
      this.startY < 0 ||
      this.startX < 0 ||
      this.startY > this.lengthY ||
      this.startX > this.lengthX
    ) {
        console.log("You left the game area. You lost the game!\n");
    } else if (this.board[this.startY][this.startX] === hat) {
        console.log("You won the game!\n");
    } else if (this.board[this.startY][this.startX] === hole) {
        console.log("You fell into a hole. You lost the game!\n");
    } else {
      this.board[this.startY][this.startX] = pathCharacter;
      this.play();
    }
  }
}

const myField = new Field(Field.generateField(5, 5, 50));
myField.play();
