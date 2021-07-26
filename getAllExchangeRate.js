
const getAllExchangeRate = (exchangeRates)=>{
// invertedRate function helps me to get the right rate when I reverse the exchange rate (four digit after comma).
const invertedRate = (rate) => {
    return Math.round((1 / rate) * 10000) / 10000;
  };
  
  // combineRoundRate function gives the four digit after comma round combination of two rates given as rate1 and rate2.
  const combineRoundRate = (rate1, rate2) => {
    return Math.round(rate1 * rate2 * 10000) / 10000;
  };
  
  // reverseRates is the reverse version of exchangeRates.
  let reverseRates = exchangeRates.map((e) => ({
    from: e.to,
    to: e.from,
    rate: invertedRate(e.rate),
    round: 1,
  }));
  
  // exchangeRates now contain all conversion possible with given entry rates and their opposite.
  exchangeRates = exchangeRates.concat(reverseRates);
  
  
  // uniqRate is set to contain all unique exchange currency value.
  let uniqRate = new Set();
  
  exchangeRates.map((e) => {
    uniqRate.add(e.from);
  });
  
  // longestPath is initialised with exchangeRates, it will be needed to determine when to stop trying to find new combined conversion possibility
  let longestPath = exchangeRates;

  
  // filterOutElementsIfIn function takes 2 array as parameters and compare if one in array2 is already in array1 and keep only the smallest unique way to convert between two currencies.
  const filterOutElementsIfIn = (array1, array2) => {
    let result = [];
    for (let i = 0; i < array1.length; i++) {
      let keep = true;
      for (let j = 0; j < array2.length; j++) {
        if (array1[i].from === array2[j].from && array1[i].to === array2[j].to) {
          keep = false;
          break;
        }
      }
      if (keep) {
        result = [...result, array1[i]];
      }
    }
    return result;
  }
  
  // loop to find all conversion possible between given currencies and store them in exchangeRates array.
  while (true) {
  
    //console.log(exchangeRates);
    //console.log(longestPath);
  
    let doubleRate = [...uniqRate].map((currency) => {
      let firstStep = longestPath.filter((e) => e.from === currency);
      let secondStep = firstStep.map((e) => {
        let secondValue = e.to;
        let fromSecondValue = exchangeRates.filter(
          (el) => el.from === secondValue && e.from !== el.to
        );
        let combinedValue = fromSecondValue.map((el) => ({
          from: e.from,
          to: el.to,
          rate: combineRoundRate(e.rate, el.rate),
          round: e.round + 1,
        }));
        //console.log({"e":e,"fromSecondValue": fromSecondValue,"combinedValue": combinedValue});
        return combinedValue;
      });
  
      return secondStep.flat();
    }).flat();
  
    // console.log({ "doubleRate": doubleRate })
  
  
    let tempUniqDoubleRate = filterOutElementsIfIn(doubleRate, exchangeRates);
  
    // console.log({ "uniqDoubleRate": uniqDoubleRate });
  
    // final loop to remove double rates and keep the best rate between two.
    let uniqDoubleRate = [];
    for (let i = 0; i < tempUniqDoubleRate.length; i++) {
      let keep = true;
      for (let j = 0; j < tempUniqDoubleRate.length; j++) {
        if (tempUniqDoubleRate[i].from === tempUniqDoubleRate[j].from && tempUniqDoubleRate[i].to === tempUniqDoubleRate[j].to) {
          if (tempUniqDoubleRate[i].rate > tempUniqDoubleRate[j].rate) {
            keep = false;
            break;
          }
        }
      }
      if (keep) {
        uniqDoubleRate = [...uniqDoubleRate, tempUniqDoubleRate[i]];
      }
    }
  
    longestPath = uniqDoubleRate;
  
    exchangeRates = exchangeRates.concat(longestPath);
    //console.log({ "uniqUniq": uniqDoubleRate, "exchangeRates": exchangeRates, "length":exchangeRates.length });
    
    if (longestPath.length === 0) {
      break;
    }
  }
  // end of while loop
  return exchangeRates;
}
  module.exports = getAllExchangeRate;