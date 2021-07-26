

// calcul the amount converted in the target currency
const calculConversionAmount = (start,amount,target,exchangeRates) => {
    let targetRate=exchangeRates.find((conversion)=> (conversion.from===start)&&(conversion.to===target));
    return Math.round(amount*targetRate.rate);
  };
  
  module.exports = calculConversionAmount;