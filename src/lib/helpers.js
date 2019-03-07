export function formatMoney(amount) {
  const options = {
    //   style: "currency",
    minimumFractionDigits: 2
  };
  //   // if its a whole, dollar amount, leave off the .00
  if (amount % 100 === 0) options.minimumFractionDigits = 0;
  const formatter = new Intl.NumberFormat("en-US", options);
  return formatter.format(amount);
}

export function checkIsNumberInput(e) {
  if (
    (e.which >= 48 && e.which <= 57) ||
    (e.which >= 96 && e.which <= 105) ||
    e.which === 8 ||
    e.which === 9 ||
    e.which === 13 ||
    // Home and End
    e.which === 35 ||
    e.which === 36 ||
    // left and right arrows
    e.which === 37 ||
    e.which === 39 ||
    // Del and Ins
    e.which === 46 ||
    e.which === 45
  )
    return true;
  return false;
}
