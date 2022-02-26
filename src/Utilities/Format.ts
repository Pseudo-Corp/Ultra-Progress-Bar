/**
 * Format any number to something pretty! Code lifted from another project of mine, Ipsum (2021-)
 * @param n : A number to be formatted
 * @param accuracy : The amount of decimal digits to be displayed
 * @returns a string of the number formatted to specific conditions.
 */
 export const format = (n: number, accuracy = 0): string => {
    if (n < 0) return '-' + format(-n, accuracy);

    if (n >= 1e6) {
        // Get the power!
        const power = Math.floor(Math.log10(n))
        n /= Math.pow(10, power)

        return format(n, 2) + 'e' + format(power)
    }

    const truncatedNumber = Math.floor(n);
    const decimalValue = n - truncatedNumber;

    const stringedInteger = truncatedNumber.toLocaleString();

    const decimalPoint = accuracy > 0 && n !== 0;

    let returnDecimalRaw = Math.pow(10, accuracy) * decimalValue;

    // Fix Float Point Error!
    const tolerance = 1e-6;
    if (Math.ceil(returnDecimalRaw) - returnDecimalRaw < tolerance)
        returnDecimalRaw = Math.ceil(returnDecimalRaw);
    // End of Fix Float Point Error!

    let returnDecimalValue = decimalPoint
        ? Math.floor(returnDecimalRaw).toString()
        : '';

    if (returnDecimalValue !== '') {
        while (returnDecimalValue.length < accuracy) {
            returnDecimalValue = '0' + returnDecimalValue;
        }

        returnDecimalValue = '.' + returnDecimalValue;
    }

    return stringedInteger + returnDecimalValue;
};