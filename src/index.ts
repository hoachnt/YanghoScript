import interpretator from "./interpretator";

const code = `
    text = 'Hoach';
    NOILIENTUC text;
    summ = 6 + 5;
    NOILIENTUC summ;
    sumandmin = summ - (20 + 2);
    NOILIENTUC sumandmin;
    `;

interpretator(code);
