/** Formats a number as Indian-grouped currency, e.g. 28450 -> "₹ 28,450". */
export const formatINR = (amount: number): string =>
  `₹ ${amount.toLocaleString("en-IN")}`;

/** First letter of a name, for avatar initials. */
export const initialOf = (name: string): string =>
  name.trim().charAt(0).toUpperCase();
