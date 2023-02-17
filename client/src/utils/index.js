export const formatCurrency = (number, currency = "USD", locale = "en-US") => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  });
  return formatter.format(number);
};
