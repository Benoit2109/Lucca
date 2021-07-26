const formatInput = require("./configInput");

let input = [
  ["EUR", 550, "JPY"],
  6,
  [
    ["AUD", "CHF", 0.9661],
    ["JPY", "KRW", 13.1151],
    ["EUR", "CHF", 1.2053],
    ["AUD", "JPY", 86.0305],
    ["EUR", "USD", 1.2989],
    ["JPY", "INR", 0.6571],
  ],
];

test("format input to usable value", () => {
  expect(formatInput(input)).toStrictEqual({
    startingCurrency: "EUR",
    targetCurrency: "JPY",
    amount: 550,
    exchangeRates: [
      { from: "AUD", to: "CHF", rate: 0.9661, round: 1 },
      { from: "JPY", to: "KRW", rate: 13.1151, round: 1 },
      { from: "EUR", to: "CHF", rate: 1.2053, round: 1 },
      { from: "AUD", to: "JPY", rate: 86.0305, round: 1 },
      { from: "EUR", to: "USD", rate: 1.2989, round: 1 },
      { from: "JPY", to: "INR", rate: 0.6571, round: 1 },
    ],
  });
});
