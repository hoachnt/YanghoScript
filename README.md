# YanghoScript

YanghoScript is a simple programming language with the ability to work with variables, arithmetic operations and display results. Was built for Vietnamese gangsters😎.

## Features

### Existing Features:

- Assignment of values to variables
- Arithmetic operations
- Outputting results
- Comment out a line of code

### Upcoming Features (Not Really Soon):

- Conditional statements
- Looping constructs
- Functions
- Error handling

## Installation

To get started with YanghoScript, you'll need Node.js. Download and install it from the [official Node.js website](https://nodejs.org/).

Then follow these steps:

1. Clone the repository:

```
git clone https://github.com/hoachnt/YanghoScript.git
```

2. Install dependencies:

```
cd YanghoScript
npm install
```

## Usage

After installation, you can use YanghoScript to execute programs written in this language. Open the `code.ys` file and write your YanghoScript code in it.

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

// True/False operations
NOILIENTUC 1 EQUAL 1;
NOILIENTUC 2 MORE THAN 1;
NOILIENTUC 1 LESS THAN 2;
NOILIENTUC 1 MORE EQUALS 1;
NOILIENTUC 2 LESS EQUALS 2;

NOILIENTUC 2 EQUAL 1;
NOILIENTUC 2 MORE THAN 3;
NOILIENTUC 1 LESS THAN 0;
NOILIENTUC 1 MORE EQUALS 2;
NOILIENTUC 2 LESS EQUALS 1;

// NOILIENTUC 1 + 2;
```

To run a program, use the following command in the terminal:

```
npm start
```

or

```
yarn start
```

Ensure that your code is written in the `code.ys` file.

## Code Structure

YanghoScript supports the following constructs:

- Assignment of values to variables: `variable = value;`
- Arithmetic operations: `+, -, *, /`
- Use parentheses for correct order of arithmetic operations. For example, for the expression `1 + 2 * 3`, it should be written as `1 + (2 * 3)`.

Examples of correct expressions:

```javascript
1 + 2 * 3; // Result: 9(incorrect)
1 + (2 * 3); // Result: 7(correct)
10 / (2 + 3); // Result: 2(correct)
```

Using parentheses ensures the correct order of operations and prevents errors in calculations.

## Important

YanghoScript is in an early stage of development and may have some limitations and shortcomings. If you find any bugs or have suggestions for improvements, feel free to report them in the Issues section on GitHub.

Don't forget that YanhoScript is a joke programming language.
