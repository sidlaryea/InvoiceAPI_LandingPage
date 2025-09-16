/**
 * Format a number with commas as thousand separators
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number with commas
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return '0';
  
  // Round to specified decimal places
  const rounded = Number(num).toFixed(decimals);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = rounded.split('.');
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Combine with decimal part if it exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
