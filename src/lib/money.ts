const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formato de la tienda de referencia: "$ 1,199.00" (opcionalmente con "MXN"). */
export function formatMoney(cents: number, withCurrency = false): string {
  const value = `$ ${formatter.format(cents / 100)}`;
  return withCurrency ? `${value} MXN` : value;
}
