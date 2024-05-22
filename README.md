# YanghoScript

YanghoScript is a simple programming language with features for working with variables, arithmetic operations, and outputting results.

## Installation

To get started with YanghoScript, you'll need Node.js. Download and install it from the [official Node.js website](https://nodejs.org/).

Then follow these steps:

1. Clone the repository:

```
git clone https://github.com/your_username/YanghoScript.git
```

2. Install dependencies:

```
cd YanghoScript
npm install
```

## Usage

After installation, you can use YanghoScript to execute programs written in this language. Create a file with the `.yangho` extension and write your YanghoScript code in it.

Example code:

```javascript
// Assigning a string value to the variable text
text = 'Hoach';
// Assigning the result of addition of numbers to the variable summ
summ = 6 + 5;

// Output the contents of variables to the screen
NOILIENTUC text;
NOILIENTUC summ;

// Assigning the result of an expression to the variable sumandmin
sumandmin = summ - ((20 + 2) * 2);

// Output the result of the expression and a string to the screen
NOILIENTUC sumandmin;
NOILIENTUC 'Chao ca lo nha minh nha';
```

To run a program, use the following command in the terminal:

```
node index.js your_script.yangho
```

Where `your_script.yangho` is the path to your YanghoScript code file.

## Code Structure

YanghoScript supports the following constructs:

- Assignment of values to variables: `variable = value;`
- Arithmetic operations: `+, -, *, /`
- Use parentheses for correct order of arithmetic operations. For example, for the expression `1 + 2 * 3`, it should be written as `1 + (2 * 3)`.

Examples of correct expressions:

```javascript
result = 1 + 2 * 3; // Result: 7
divisionResult = 10 / (2 + 3); // Result: 2
```

Using parentheses ensures the correct order of operations and prevents errors in calculations.

## Important

YanghoScript is in the early stages of development and may have some limitations and shortcomings. If you find any bugs or have suggestions for improvement, feel free to report them in the Issues section on GitHub.
