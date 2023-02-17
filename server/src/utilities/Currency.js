export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export const convert = (amount, currency = "USD") => {
  let convertedAmnt = amount;
  if (currency.toUpperCase() === "INR") {
    convertedAmnt = Math.round(amount * 82.61905);
  }
  return convertedAmnt;
};

export const convertToObj = (amount, currency = "USD") => {
  let convertedAmnt = convert(amount, currency);
  return {
    amount: convertedAmnt,
    currency,
    displayAmount: formatCurrency(convertedAmnt, currency),
  };
};
