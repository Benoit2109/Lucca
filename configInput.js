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
  
  //

  const formattedInput = (input)=> ({
    startingCurrency: input[0][0],
    targetCurrency: input[0][2],
    amount: input[0][1],
    exchangeRates:
      input[2].map((el)=>(
          {
              from:el[0],
              to:el[1],
              rate:el[2],
              round:1,
          }
      )).flat()
    
  });

  //console.log(formattedInput(input));
  


  module.exports = formattedInput;
  
  
  