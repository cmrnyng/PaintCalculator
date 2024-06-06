import inquirer from "inquirer";

class Wall {
  len: number;
  height: number;
  colour: string;
  excludedLen: number;
  excludedHeight: number;

  constructor(
    len: number,
    height: number,
    colour: string,
    excludedLen: number = 0,
    excludedHeight: number = 0
  ) {
    this.len = len;
    this.height = height;
    this.colour = colour;
    this.excludedLen = excludedLen;
    this.excludedHeight = excludedHeight;
  }

  calculateArea() {
    return this.len * this.height - this.excludedLen * this.excludedHeight;
  }
}

const walls: Wall[] = [];

console.log("\nHey there! Welcome to Paint It All.\n");

const initialQuestions = await inquirer.prompt([
  {
    // First question
    type: "input",
    name: "userName",
    message: "What is your name?",
  },
  {
    // Second question
    type: "number",
    name: "walls",
    // Function to get name of user in previous question
    message: answers =>
      `Hey ${answers.userName}, enter the total number of walls you would like to paint:`,
    validate: (input: string) => {
      // Validate the input as a number
      const num = parseInt(input, 10); // Convert input to a base 10 integer, num
      if (isNaN(num) || num <= 0) {
        // If num is not a number or num is negative
        return "Please enter a valid number greater than 0."; // Return with this message
      }
      return true; // Otherwise return true, and move onto the next question
    },
    filter: (input: string) => {
      // Remove any non numeric values
      const num = parseInt(input, 10); // Convert input to a base 10 integer, num
      return isNaN(num) || num <= 0 ? "" : input; // If num is not a number of is negative, return an empty string. Else, return input.
    },
  },
]);

const numOfWalls = initialQuestions.walls;

const wallQuestions: object[] = [];
for (let i = 0; i < numOfWalls; i++) {}
