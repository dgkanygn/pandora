/**
 * Formats a price value to a locale string (tr-TR).
 * If the decimal part is 0, it returns only the integer part.
 * Otherwise, it shows up to 2 decimal places.
 * 
 * @param price - Price as number or string
 * @returns Formatted price string
 */
export const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) return '0';

    // Check if integer
    const isInteger = numPrice % 1 === 0;

    return numPrice.toLocaleString('tr-TR', {
        minimumFractionDigits: isInteger ? 0 : 2,
        maximumFractionDigits: 2
    });
};
