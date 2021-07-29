const calculAmount = require("./calculNewAmount");

let start = "EUR";
let amount = 550;
let target = "JPY";
let exchangeRates = [
  { from: "AUD", rate: 0.9661, round: 1, to: "CHF" },
  { from: "JPY", rate: 13.1151, round: 1, to: "KRW" },
  { from: "EUR", rate: 1.2053, round: 1, to: "CHF" },
  { from: "AUD", rate: 86.0305, round: 1, to: "JPY" },
  { from: "EUR", rate: 1.2989, round: 1, to: "USD" },
  { from: "JPY", rate: 0.6571, round: 1, to: "INR" },
  { from: "CHF", rate: 1.0351, round: 1, to: "AUD" },
  { from: "KRW", rate: 0.0762, round: 1, to: "JPY" },
  { from: "CHF", rate: 0.8297, round: 1, to: "EUR" },
  { from: "JPY", rate: 0.0116, round: 1, to: "AUD" },
  { from: "USD", rate: 0.7699, round: 1, to: "EUR" },
  { from: "INR", rate: 1.5218, round: 1, to: "JPY" },
  { from: "AUD", rate: 0.8016, round: 2, to: "EUR" },
  { from: "AUD", rate: 1128.2986, round: 2, to: "KRW" },
  { from: "AUD", rate: 56.5306, round: 2, to: "INR" },
  { from: "JPY", rate: 0.0112, round: 2, to: "CHF" },
  { from: "EUR", rate: 1.2476, round: 2, to: "AUD" },
  { from: "CHF", rate: 89.0502, round: 2, to: "JPY" },
  { from: "CHF", rate: 1.0777, round: 2, to: "USD" },
  { from: "KRW", rate: 0.0501, round: 2, to: "INR" },
  { from: "KRW", rate: 0.0009, round: 2, to: "AUD" },
  { from: "USD", rate: 0.928, round: 2, to: "CHF" },
  { from: "INR", rate: 19.9586, round: 2, to: "KRW" },
  { from: "INR", rate: 0.0177, round: 2, to: "AUD" },
  { from: "AUD", rate: 1.0412, round: 3, to: "USD" },
  { from: "JPY", rate: 0.0093, round: 3, to: "EUR" },
  { from: "JPY", rate: 0.0121, round: 3, to: "USD" },
  { from: "EUR", rate: 107.3317, round: 3, to: "JPY" },
  { from: "EUR", rate: 1407.6653, round: 3, to: "KRW" },
  { from: "EUR", rate: 70.5276, round: 3, to: "INR" },
  { from: "CHF", rate: 1167.9023, round: 3, to: "KRW" },
  { from: "CHF", rate: 58.5149, round: 3, to: "INR" },
  { from: "KRW", rate: 0.0009, round: 3, to: "CHF" },
  { from: "KRW", rate: 0.0007, round: 3, to: "EUR" },
  { from: "USD", rate: 0.9606, round: 3, to: "AUD" },
  { from: "USD", rate: 82.6386, round: 3, to: "JPY" },
  { from: "INR", rate: 0.0171, round: 3, to: "CHF" },
  { from: "INR", rate: 0.0142, round: 3, to: "EUR" },
  { from: "KRW", rate: 0.0009, round: 4, to: "USD" },
  { from: "USD", rate: 1083.8135, round: 4, to: "KRW" },
  { from: "USD", rate: 54.3018, round: 4, to: "INR" },
  { from: "INR", rate: 0.0184, round: 4, to: "USD" },
  { from: "INR", rate: 0.0184, round: 4, to: "USD" },
];


    test("get right conversion price",()=> {
        expect(calculAmount(start, amount, target, exchangeRates)).toStrictEqual(59032);
    });
  

