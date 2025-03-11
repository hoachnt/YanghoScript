YanghoScript is a simple programming language with the ability to work with variables, arithmetic operations, and display results. Was built for Vietnamese gangsters😎.

## Features

### Existing Features:

-   Assignment of values to variables
-   Arithmetic operations
-   Outputting results
-   Comment out a line of code
-   Conditional statements
-   Functions (Partially implemented)

### Upcoming Features (Not Really Soon):

-   Looping constructs
-   Error handling

## Installation

To get started with YanghoScript, you'll need Node.js. Download and install it from the [official Node.js website](https://nodejs.org/).

Then follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/hoachnt/YanghoScript.git
```

2. Install dependencies:

```bash
cd YanghoScript
bun install
```

## Usage

After installation, you can use YanghoScript to execute programs written in this language. Open the `code.ys` file and write your YanghoScript code in it.

### Variable Assignment

```javascript
text BAYHETVAODAY 'Hoach';
summ BAYHETVAODAY 6 CONG 5;
```

### Outputting Results

```javascript
NOILIENTUC text;
NOILIENTUC summ;
```

### Arithmetic Operations

```javascript
sumandmin BAYHETVAODAY summ TRU ((20 CONG 2) NHAN 2);
NOILIENTUC sumandmin;
```

### Comparisons

```javascript
NOILIENTUC 1 UY TIN 1;
NOILIENTUC 2 NHIEU HON 1;
NOILIENTUC 1 IT HON 2;
NOILIENTUC 1 NHIEU BANG 1;
NOILIENTUC 2 IT BANG 2;
```

### Conditional Statements

```javascript
NEU (2 UY TIN 1) {
    NOILIENTUC 'Yasuo';
} KO THI NEU (2 NHIEU HON 1) {
    NOILIENTUC 'Kosuo';
} KO THI {
    NOILIENTUC 'Default';
}
```

### Functions

```javascript
// Create a function
HAM greet(name) {
    NOILIENTUC 'Hello, ' CONG name;
}

// Call a function
greet('Hoachnt');
```

### Comments

```javascript
// NOILIENTUC 'Hello world' - comment
```

To run a program, use the following command in the terminal:

```
bun start
```

Ensure that your code is written in the `code.ys` file.

## Code Structure

YanghoScript supports the following constructs:

-   Assignment of values to variables: `variable = value;`
-   Arithmetic operations: `+, -, *, /`
-   Use parentheses for correct order of arithmetic operations.

Examples of correct expressions:

```javascript
1 CONG 2 NHAN 3; // Result: 9(incorrect)
1 CONG (2 NHAN 3); // Result: 7(correct)
10 CHIA (2 CONG 3); // Result: 2(correct)
```

Using parentheses ensures the correct order of operations and prevents errors in calculations.

## Important

YanghoScript is in an early stage of development and may have some limitations and shortcomings. If you find any bugs or have suggestions for improvements, feel free to report them in the Issues section on GitHub.

Don't forget that YanghoScript is a joke programming language.

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://hoachnt.com/"><img src="https://avatars.githubusercontent.com/u/91771575?v=4?s=100" width="100px;" alt="Nguyen Tien Hoach"/><br /><sub><b>Nguyen Tien Hoach</b></sub></a><br /><a href="https://github.com/hoachnt/YanghoScript/commits?author=hoachnt" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
