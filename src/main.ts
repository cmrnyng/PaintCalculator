import inquirer from "inquirer";
import chalk from "chalk";

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

  calculateArea(): number {
    return this.len * this.height - this.excludedLen * this.excludedHeight;
  }
}

const walls: Wall[] = [];

// Function to validate the user's input
const validateInput = (input: string, checkInt: boolean): boolean => {
  const num = Number(input);
  // Validate the input as a number
  if (isNaN(num) || num <= 0 || (checkInt && !Number.isInteger(num))) {
    // If input is not a number or input is negative
    return false; // Return false
  }
  return true; // Otherwise return true, and move onto the next question
};

// Validate real numbers
const validateNum = (input: string): boolean => validateInput(input, false);
// Validate integers
const validateInt = (input: string): boolean => validateInput(input, true);

// Function to remove invalid inputs from the input field after the user submits
const filterInput = (input: any, checkInt: boolean): string | number => {
  // If input is not a number or is negative, or 'checkInt' is true and it is not an integer,
  if (isNaN(input) || input <= 0 || (checkInt && !Number.isInteger(input))) {
    return ""; // Return an empty string
  }
  return input; // Else return the user's input
};

// Remove any input which is not a real number
const filterNum = (input: any): string | number => filterInput(input, false);
// Remove any input which is not an integer
const filterInt = (input: any): string | number => filterInput(input, true);

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
    type: "input",
    name: "walls",
    // Function to get name of user in previous question
    message: answers =>
      `Hey ${answers.userName}, please enter the total number of walls you would like to paint:`,
    validate: (input: string): string | boolean =>
      validateInt(input) ? true : "Please enter a valid whole number greater than 0.",
    transformer: (input: string): string => {
      const num = Number(input);
      if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        return chalk.red(input);
      }
      return input;
    },
  },
]);

initialQuestions.walls = Number(initialQuestions.walls);

const numOfWalls = initialQuestions.walls;

for (let i = 1; i <= numOfWalls; i++) {
  const ui = new inquirer.ui.BottomBar();
  ui.updateBottomBar(`${new inquirer.Separator()}\nWall ${i}\n${new inquirer.Separator()}\n`);

  const wallInfo = await inquirer.prompt([
    {
      type: "input",
      name: "len",
      message: `Please enter the length of wall ${i} in metres:`,
      validate: (input: string): string | boolean =>
        validateNum(input) ? true : "Please enter a valid number greater than 0.",
      transformer: (input: string): string => (validateNum(input) ? input : chalk.red(input)),
    },
    {
      type: "input",
      name: "height",
      message: `Please enter the height of wall ${i} in metres:`,
      validate: (input: string): string | boolean =>
        validateNum(input) ? true : "Please enter a valid number greater than 0.",
      transformer: (input: string): string => (validateNum(input) ? input : chalk.red(input)),
    },
    {
      type: "list",
      name: "colour",
      message: `What colour you would like wall ${i} to be?`,
      choices: ["White", "Cream", "Beige", "Brown", "Grey", "Purple", "Blue", "Green", "Yellow"],
    },
    {
      type: "confirm",
      name: "exclusions",
      message: `Do you have any areas you would like to exclude and not cover on wall ${i} (windows, doors, etc)?`,
    },
  ]);

  if (!wallInfo.exclusions) {
    walls.push(new Wall(Number(wallInfo.len), Number(wallInfo.height), wallInfo.colour));
    continue;
  }

  const exclusions = await inquirer.prompt([
    {
      type: "input",
      name: "len",
      message: `Enter the total length you would like to exclude from wall ${i} in metres:`,
      validate: (input: string): string | boolean =>
        !validateNum(input)
          ? "Please enter a valid number greater than 0."
          : Number(input) >= Number(wallInfo.len)
          ? `Please enter a number less than the length of the wall (${Number(wallInfo.len)}m).`
          : true,
      transformer: (input: string): string =>
        validateNum(input) && Number(input) < Number(wallInfo.len) ? input : chalk.red(input),
    },
    {
      type: "input",
      name: "height",
      message: `Enter the total height you would like to exclude from wall ${i} in metres:`,
      validate: (input: string): string | boolean =>
        !validateNum(input)
          ? "Please enter a valid number greater than 0."
          : Number(input) >= Number(wallInfo.height)
          ? `Please enter a number less than the height of the wall (${Number(wallInfo.height)}m).`
          : true,
      transformer: (input: string): string =>
        validateNum(input) && Number(input) < Number(wallInfo.height) ? input : chalk.red(input),
    },
  ]);

  walls.push(
    new Wall(
      Number(wallInfo.len),
      Number(wallInfo.height),
      wallInfo.colour,
      Number(exclusions.len),
      Number(exclusions.height)
    )
  );
}

for (const wall of walls) {
  console.log(wall);
}
